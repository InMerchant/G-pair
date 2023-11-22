import sys

# 명령줄 인수로 웹툰 ID와 에피소드 번호를 받음
if len(sys.argv) >= 3:
    webtoon_id = sys.argv[1]
    episode_number = sys.argv[2]

    # 웹툰 ID와 에피소드 번호를 사용하여 원하는 작업을 수행
    # 예: 웹툰 ID와 에피소드 번호를 기반으로 데이터베이스에서 해당 에피소드 정보를 검색하거나 다른 작업을 수행

    print(f"Received Webtoon ID: {webtoon_id}")
    print(f"Received Episode Number: {episode_number}")
else:
    print("No Webtoon ID or Episode Number received")
