# 이미지분석 AI모델을 사용한 이미지 검색 기술과 분석 서비스
텍스트 기반으로 이미지 캡션을 생성하여 이미지를 검색하는 기능을 포함한 웹툰 서비스

# 구현내용
상황검색, 대사검색 유해요소 대시보드를 지원하는 서비스 개발

1. 이미지 캡션
  - 현재 이미지가 어떠한 상황인지 분석하여 텍스트로 변환 (blip 모델) 사용

2. OCR을 사용한 문장 추출
  - 말풍선 및 이미지의 글자를 추출하여 텍스트로 변환 (EasyOCR을 사용)

3. 윤리검증을 위한 문장 분류
  - 추출된 문장, 상황에서 변환된 텍스트를 BART 모델을 사용하여 각 텍스트 비난, 차별, 혐오, 선정, 욕설, 폭력, 범죄, 중립 구별

4. 대시보드로 결과 표현
  - 윤리검증을 통해 분류된 문장으로 대시보드를 생성하여 사용자에게 시각적 경험 제공


# 시나리오 구상도
![시나리오 구성도](https://github.com/InMerchant/Scene-Search/assets/106319540/f136d003-901c-41d5-88f5-9fc269d4360f)

# 모델 적용 예시
![모델 적용 예시](https://github.com/InMerchant/Scene-Search/assets/106319540/1697bb5a-1dda-491d-a7eb-e16ff317e807)

# 아키텍쳐 설계도
![아키텍쳐 설계도](https://github.com/InMerchant/Scene-Search/assets/106319540/b5ef5698-8946-4de2-9b88-1ccce7710555)

# 화면 정의
![화면정의](https://github.com/InMerchant/Scene-Search/assets/106319540/fe14f260-cfe8-4cc5-aa57-ef2fc79bfa4a)

# 대사 검색
![대사검색](https://github.com/InMerchant/Scene-Search/assets/106319540/3c361816-87b2-404c-8c18-4d8d1295b5d8)

# 상황 검색
![상황검색](https://github.com/InMerchant/Scene-Search/assets/106319540/7878f4b9-078f-4291-b2fc-f41977dcce23)

# 유해요소 대시보드
![유해요소 대시보드](https://github.com/InMerchant/Scene-Search/assets/106319540/a8d8583d-f2cc-4988-917d-8c859ee9f493)

# 시연 영상
[링크] https://youtu.be/cj6GSZxhgvU?si=UKIPp_eXCcq_2usG
