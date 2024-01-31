// 책 정보를 파싱하는 함수
function parseBookInfo() {
  // 메인 제목과 부제목을 가져오기 위한 셀렉터
  const mainTitle = document.querySelector(".gd_name").innerText;
  const subTitle = document.querySelector(".gd_nameE").innerText;

  // 저자 정보
  const authorElement = document.querySelector('a[href*="authorNo"]');
  const authorName = authorElement.innerText;
  const authorLink = authorElement.href;

  // 리뷰 총점
  const rating = document.querySelector("#spanGdRating .yes_b").innerText;

  // 이미지 URL
  const imageSrc = document.querySelector(".gImg").src;

  // 발행일
  const publishDate = document.querySelector(".gd_date").innerText;

  // 카테고리 정보를 파싱하는 부분
  const categoryElements = document.querySelectorAll(
    'li a[href*="/Category/Display/"]'
  );
  const categories = Array.from(categoryElements)
    .map((el) => el.innerText.trim())
    .join(" -> ");

  // 파싱한 데이터를 객체로 구성
  const bookData = {
    imageSrc, // 이미지 URL
    title: {
      h2: mainTitle, // 메인 제목
      h3: subTitle, // 부제목
    },
    author: {
      name: authorName, // 저자 이름
      link: authorLink, // 저자 정보 링크
    },
    rating, // 리뷰 총점
    publishDate, // 발행일
    categories, // 카테고리
  };

  console.log(bookData);
  // 여기서 파싱한 정보를 옵시디언으로 전송하는 로직을 추가합니다.
}
// console.log(bookData);
// console.log("test");

// 페이지 로드 완료 시 책 정보 파싱
window.addEventListener("load", parseBookInfo);
