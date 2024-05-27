// 책 정보를 파싱하는 함수
function parseBookInfo() {
  // 메인 제목
  const mainTitle = document.querySelector(".gd_name").innerText;
  // 부 제목
  const subTitle = document.querySelector(".gd_nameE").innerText;
  // 이미지 URL
  const imageSrc = document.querySelector(".gImg").src;
  // 저자 정보
  const authorElements = document.querySelectorAll('.gd_auth a');
  const authors = Array.from(authorElements).map(author => ({
    name: author.innerText,
    link: author.href
  }));
  // 도서 제본 방식
  const featureElement = document.querySelector(".gd_feature");
  const feature = featureElement ? featureElement.innerText : "";
  // 리뷰 총점
  const rating = document.querySelector("#spanGdRating .yes_b").innerText;

  // 리뷰 수
  const reviewCount = document.querySelector(".gd_reviewCount .txC_blue").innerText;
  
  // 출판사
  const publisher = document.querySelector(".gd_pub a").innerText;
  // XPath를 사용하여 특정 텍스트를 포함하는 th 요소를 찾고, 그 다음 형제 요소인 td 요소를 가져옴
  const getTextByXPath = (xpath) => {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue ? result.singleNodeValue.innerText : "";
  };

  // ISBN
  const isbn13 = getTextByXPath('//th[contains(text(), "ISBN13")]/following-sibling::td');
  const isbn10 = getTextByXPath('//th[contains(text(), "ISBN10")]/following-sibling::td');
  
  // 페이지 수, 무게, 크기
  const pageInfo = getTextByXPath('//th[contains(text(), "쪽수, 무게, 크기")]/following-sibling::td');
  
  // 정가
  const listPrice = getTextByXPath('//th[contains(text(), "정가")]/following-sibling::td').trim();
  
  // 판매가
  const salePrice = getTextByXPath('//th[contains(text(), "판매가")]/following-sibling::td').trim();
  
  // YES포인트 적립
  const yesPointReward = getTextByXPath('//th[contains(text(), "YES포인트")]/following-sibling::td').trim();

  // 판매지수
  const salesPointText = document.querySelector(".gd_sellNum").innerText.trim();
  const salesPoint = salesPointText.match(/\d+,\d+/)[0];

  // 베스트 순위
  const bestRank = document.querySelector(".gd_best dd a").innerText.trim();

  // 발행일
  const publishDate = document.querySelector(".gd_date").innerText;

  // 카테고리 정보를 파싱하는 부분
  const categoryElements = document.querySelectorAll('dl.yesAlertDl li');
  const categories = Array.from(categoryElements).map(li => {
    return Array.from(li.querySelectorAll('a')).map(a => a.innerText.trim()).join(" > ");
  });

  // 파싱한 데이터를 객체로 구성
  const bookData = {
    title: {
      mainTitle: mainTitle, // 메인 제목
      subTitle: subTitle, // 부제목
    },
    imageSrc, // 이미지 URL
    authors, // 저자 정보
    
    rating, // 리뷰 총점
    reviewCount, // 리뷰 수
    
    publishDate, // 발행일
    publisher, // 출판사
    
    isbn: {
      isbn13, // ISBN13
      isbn10, // ISBN10
    },
    pageInfo, // 페이지 수, 무게, 크기
    
    price: {
      listPrice, // 정가
      salePrice, // 판매가
      yesPointReward, // YES포인트
    },
    
    salesPoint, // 판매지수
    bestRank, // 베스트 순위
    categories, // 카테고리
  };
  console.log("Sending bookData to background.js:", bookData);
  
  // 여기서 파싱한 정보를 옵시디언으로 전송하는 로직을 추가
}
// console.log(bookData);
console.log("test");

parseBookInfo();

// // 페이지 로드 완료 시 책 정보 파싱
// window.addEventListener("load", parseBookInfo);
// // DOMContentLoaded 이벤트를 사용하여 페이지 로드 완료 시 책 정보 파싱
// document.addEventListener("DOMContentLoaded", parseBookInfo);
