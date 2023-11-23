import os
import sys
import firebase_admin
from firebase_admin import credentials, storage
import requests
import csv
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from tqdm import tqdm
import time
import json
# 명령줄 인수로 웹툰 ID와 에피소드 번호를 받음
if len(sys.argv) >= 3:
    webtoon_id = sys.argv[1]
    episode_number = sys.argv[2]
else:
    print("No Webtoon ID or Episode Number received")
    sys.exit(1)

# Firebase 설정 파일 경로
cred_path = 'C:\\Users\\WIN10\\Desktop\\G-pair\\firebasekey.json'
cred = credentials.Certificate(cred_path)

# Firebase 앱 초기화
firebase_admin.initialize_app(cred, {
    'storageBucket': 'look-b1624.appspot.com'
})

# Firebase 스토리지 버킷 접근
bucket = storage.bucket()

# Firebase 스토리지 내 특정 폴더의 모든 파일을 나열
folder_path = f'{webtoon_id}/{episode_number}/'  # 웹툰 ID와 에피소드 번호를 기반으로 경로 설정
blobs = bucket.list_blobs(prefix=folder_path)  # 해당 폴더 내 모든 파일을 가져옴

# 로컬에 저장할 폴더 경로 설정
local_folder_path = f'public\\js\\board\\{webtoon_id}\\{episode_number}'

# 해당 로컬 폴더가 존재하는지 확인하고, 없으면 생성
if not os.path.exists(local_folder_path):
    os.makedirs(local_folder_path)


# 폴더 내의 모든 파일을 다운로드
for blob in blobs:
    # 파일 이름 추출
    file_name = blob.name.split('/')[-1]

    # 로컬 파일 경로 설정
    local_file_path = os.path.join(local_folder_path, file_name)

    # 파일 다운로드
    blob.download_to_filename(local_file_path)

# 이미지 파일들이 있는 폴더 경로
folder_path = local_folder_path

# 폴더 내의 모든 파일 목록 가져오기
file_list = os.listdir(folder_path)

# PNG 파일만 골라내기
png_files = [file for file in file_list if file.lower().endswith('.png')]

# PNG 파일 수 확인
num_png_files = len(png_files)

# 새로운 파일 이름으로 파일들 이름 변경하기
for i, file_name in enumerate(png_files, start=1):
    # 번호의 자릿수에 맞게 포맷팅하여 새로운 파일 이름 생성
    new_file_name = f'{i:0{len(str(num_png_files))}}.png'
    
    # 기존 파일을 새로운 이름으로 변경
    os.rename(os.path.join(folder_path, file_name), os.path.join(folder_path, new_file_name))
print("넘버링 완료")
#2. 이미지 캡션 생성 후 번역 후 정제

# 'vitImg'와 'vitCsv' 폴더 경로
vit_img_path = os.path.join(local_folder_path, 'vitImg')
vit_csv_path = os.path.join(local_folder_path, 'vitCsv')

# 폴더 생성 함수
def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")
    else:
        print(f"Directory already exists: {path}")

# 'vitImg'와 'vitCsv' 폴더 생성
create_directory(vit_img_path)
create_directory(vit_csv_path)


# Blip 모델과 프로세서 불러오기
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

# 이미지가 있는 디렉토리와 CSV 파일을 저장할 디렉토리 경로 설정
image_dir = local_folder_path
csv_dir = vit_csv_path
csv_filename = '상황.csv'

# 이미지 파일 목록 가져오기
image_files = [f for f in os.listdir(image_dir) if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png')]
total_images = len(image_files)

# CSV 파일 생성 및 헤더 추가
csv_path = os.path.join(csv_dir, csv_filename)
with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
    csv_writer = csv.writer(csvfile)
    #csv_writer.writerow(['파일이름', '이미지캡션'])

# 진행 상황 로딩 바 설정 (폭을 절반으로 줄임)
with tqdm(total=total_images, desc="이미지 처리 중", ncols=50) as pbar:
    for filename in image_files:
        img_path = os.path.join(image_dir, filename)
        
        # 이미지 열기
        raw_image = Image.open(img_path).convert('RGB')

        # 이미지 캡션 생성
        inputs = processor(raw_image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        # CSV 파일에 결과 추가
        with open(csv_path, 'a', newline='', encoding='utf-8') as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerow([filename, caption])

        # 진행 상황 업데이트
        pbar.update(1)

# 작업 완료 메시지 표시
print("이미지 캡션 생성 및 CSV 파일 저장 완료.")
import csv
from googletrans import Translator

# 구글 번역기 초기화
translator = Translator()

# 입력 CSV 파일 경로
input_csv_file_path = f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황.csv'



# 번역 함수
def translate_text(text, target_lang):
    try:
        translation = translator.translate(text, dest=target_lang)
        return translation.text
    except Exception as e:
        print(f"번역 중 오류 발생: {e}")
        return "번역 실패"

# CSV 파일 열기 및 번역
translated_data = []

with open(input_csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
    csvreader = csv.reader(csvfile)
    for row in csvreader:
        if len(row) == 2:  # CSV 파일의 각 행은 두 개의 열로 구성되어야 합니다
            image_name, english_sentence = row[0], row[1]
            translated_sentence = translate_text(english_sentence, 'ko')
            translated_data.append([image_name, translated_sentence])

# 번역된 내용을 CSV 파일에 저장
translated_csv_file_path = f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황.csv'

with open(translated_csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerows(translated_data)

if translated_data:
    print("번역이 완료되었습니다.")
else:
    print("번역된 내용이 없습니다.")
    

# 기존 CSV 파일 경로 및 새로 저장할 CSV 파일 경로
csv_path = f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황.csv'
new_csv_path = f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\정제된상황.csv'

# 삭제할 단어들 리스트로 지정
delete_words = ["그림", "만화", "클로즈업", "애니메이션", "이미지", "아라페드", "캐릭터", "포스터", ]  # 삭제할 단어들을 여기에 추가

# CSV 파일 읽기 및 특정 단어 삭제 후 새로운 CSV 파일로 저장
with open(csv_path, 'r', newline='', encoding='utf-8') as infile, open(new_csv_path, 'w', newline='', encoding='utf-8') as outfile:
    csv_reader = csv.reader(infile)
    csv_writer = csv.writer(outfile)

    for row in csv_reader:
        # 여러 단어를 한 번에 삭제하기 위해 반복문 사용
        cleaned_row = []
        for cell in row:
            if isinstance(cell, str):
                # 특정 단어들을 포함하는 경우 삭제 후 새로운 행으로 작성
                for word in delete_words:
                    cell = cell.replace(word, '')
            cleaned_row.append(cell)
        csv_writer.writerow(cleaned_row)

print(f'지정한 단어들을 포함한 텍스트를 삭제한 후 새로운 CSV 파일로 저장했습니다.')
#3. OCR대사 추출과 이미지캡션과 대사 csv병합
import os
import csv
import re
import easyocr
from tqdm import tqdm

# 폴더 내 이미지 파일 목록 얻기
image_folder =local_folder_path
image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]

# 정규 표현식 패턴 설정
pattern = re.compile(r'[^A-Za-z0-9가-힣\s]')

# easyocr 리더 초기화
reader = easyocr.Reader(['ko', 'en'], gpu=False)

# 결과를 저장할 CSV 파일 열기
csv_file = open(f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\대사.csv', 'w', newline='', encoding='utf-8')
csv_writer = csv.writer(csv_file)

for image_file in tqdm(image_files, desc="OCR Progress", ncols=50):
    image_path = os.path.join(image_folder, image_file)
    results = reader.readtext(image_path, detail=0)

    if results:
        output_text = ' '.join(results)

        # 기호나 특수 문자 제거
        cleaned_text = pattern.sub('', output_text)
        cleaned_text_with_slash = cleaned_text
        csv_writer.writerow([cleaned_text_with_slash])  # 파일 이름 대신 출력 문장 저장
    else:
        csv_writer.writerow(['None'])  # 결과가 없을 때 'None' 저장

# CSV 파일 닫기
csv_file.close()
print("OCR 처리 및 CSV 파일 저장 완료")
#상황대사 파일 변환
import csv

# 첫 번째 CSV 파일 읽기
with open( f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\정제된상황.csv', 'r', newline='', encoding='utf-8') as csv_file1:
    csv_reader1 = csv.reader(csv_file1)
    data1 = list(csv_reader1)

# 두 번째 CSV 파일 읽기
with open(f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\대사.csv', 'r', newline='', encoding='utf-8') as csv_file2:
    csv_reader2 = csv.reader(csv_file2)
    data2 = list(csv_reader2)

# 새로운 CSV 파일 생성 및 쓰기
with open(f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황과 대사.csv', 'w', newline='', encoding='utf-8') as merged_csv_file:
    csv_writer = csv.writer(merged_csv_file)

    # 데이터 병합하여 쓰기
    for row1, row2 in zip(data1, data2):
        file_name = row1[0]
        sentence1 = row1[1]
        sentence2 = row2[0]
        csv_writer.writerow([file_name, sentence1, sentence2])

print("두 개의 CSV 파일이 합쳐졌습니다.")
# 빈칸채우기
import csv

# CSV 파일 열기
file_path = f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황과 대사.csv'
with open(file_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    data = list(reader)

# 빈 값을 빈 문자열('')로 채우기
for row in data:
    for i, value in enumerate(row):
        if not value:
            row[i] = 'None'

# 기존 파일 덮어쓰기
with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(data)

#4. 윤리검증
import torch
from transformers import BertTokenizer, BertForSequenceClassification, BertConfig
import pandas as pd
from tqdm import tqdm
import time

def classify_sentence(sentence):
    model_path = "C:\\Users\\WIN10\\Desktop\\G-pair\\ai\\epoch_4_evalAcc_64.pth"
    tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')
    config = BertConfig.from_pretrained('bert-base-multilingual-cased', num_labels=8)
    model = BertForSequenceClassification(config)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')), strict=False)
    
    inputs = tokenizer.encode_plus(
        sentence,
        add_special_tokens=True,
        max_length=128,
        padding='max_length',
        return_attention_mask=True,
        return_tensors='pt'
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    inputs.to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()

    return predicted_class

# csv 파일 불러오기
df = pd.read_csv(f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황과 대사.csv', header=None)

# 새로운 데이터프레임 생성
new_df = pd.DataFrame()

# 파일 이름, 문장1, 문장2, 문장1의 분류 라벨링, 문장2의 분류 라벨링으로 구성
new_df['파일 이름'] = df[0]
new_df['문장1'] = df[1]
new_df['문장2'] = df[2]

start = time.time()

# tqdm을 사용하여 진행 상황을 로딩바로 표시
for i in tqdm(range(len(df)), ncols=50):
    new_df.loc[i, '문장1의 분류 라벨링'] = classify_sentence(df.loc[i, 1])
    new_df.loc[i, '문장2의 분류 라벨링'] = classify_sentence(df.loc[i, 2])

end = time.time()



# 새로운 csv 파일로 저장
new_df.to_csv(f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황과 대사_윤리검증.csv', index=False)


# 파일 읽기
df = pd.read_csv(f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황과 대사_윤리검증.csv')

# '.0'을 제거하고 숫자로 변환한 후 다시 문자열로 변환
df['문장1의 분류 라벨링'] = df['문장1의 분류 라벨링'].astype(float).astype('Int64').astype(str)
df['문장2의 분류 라벨링'] = df['문장2의 분류 라벨링'].astype(float).astype('Int64').astype(str)
# 결과를 새로운 파일에 저장
df.to_csv(f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황과 대사_윤리검증.csv', index=False)

print(f"경과 시간: {end - start}초")
    #"['CENSURE'비난]": 0,
    #"['HATE'차별]": 1,
    #"['DISCRIMINATION'혐오]": 2,
    #"['SEXUAL'선정]": 3,
    #"['ABUSE'욕설]": 4,
    #"['VIOLENCE'폭력]": 5,
    #"['CRIME'범죄]": 6,
    #"['IMMORAL_NONE']": 7,
    


def csv_to_json_and_save(csv_file, json_file):
    data = []
    
    # CSV 파일 읽기
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)
    
    # JSON 형식으로 변환
    json_data = json.dumps(data, ensure_ascii=False, indent=4)
    
    # JSON 파일로 저장
    with open(json_file, 'w', encoding='utf-8') as output_file:
        output_file.write(json_data)

# CSV 파일 경로와 저장할 JSON 파일 경로
csv_filename = f'public\\js\\board\\{webtoon_id}\\{episode_number}\\vitCsv\\상황과 대사_윤리검증.csv'
json_filename = f'public\\js\\board\\{webtoon_id}\\{episode_number}.json'

# CSV를 JSON으로 변환하고 JSON 파일로 저장
csv_to_json_and_save(csv_filename, json_filename)
print(f'변환된 데이터를 {json_filename}으로 저장했습니다.')
    