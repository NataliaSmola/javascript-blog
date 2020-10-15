'use strict';
const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);
  /* remove class 'active from all article links'*/
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
  console.log('targetArticle', targetArticle);
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleLinksSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list';

function generateTitleLinks(customSelector = '') {
  /* remove content of titleList */
  const titleList = document.querySelector(optTitleLinksSelector);

  titleList.innerHTML = '';
  /*for each article*/
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(articles);
  let html = '';

  for (let article of articles) {
    /*get the article id*/
    const articleId = article.getAttribute('id');
    /*find the title element and get the title from the title element*/
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /*create HTML of the link*/
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log(linkHTML);
    /*insert link into titleList*/
    //const titleListLink = article.insertAdjacentHTML('afterend', linkHTML);
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();


function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper*/
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    console.log(tagsWrapper);
    /* make html variable with empty string*/
    let html = '';
    /* get tags from data-tags attribute*/
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    console.log(articleTagsArray);
    /* START LOOOP: for each tag*/
    for (let tag of articleTagsArray) {
      console.log(tag);
      /* generate HTML of the link*/
      const tagLinkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log(tagLinkHTML);
      /*add generated code to html variable*/
      html = html + tagLinkHTML + ' ';
      console.log(html);
      /*END LOOP: for each tag */
    }
    /* instert HTML of all the links into the tags wrapper*/
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article*/
  }
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('link was clicked');
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log(tag);
  /*  find all tag links with class active */
  const activeLinksTags = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeLinksTags);
  /* START LOOP: for each active tag link */
  for (let activeLinksTag of activeLinksTags) {

    /* remove class active */
    activeLinksTag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const attributeLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(attributeLinks);
  /* START LOOP: for each found tag link */
  for (let attributeLink of attributeLinks) {
    /* add class active */
    attributeLink.classList.add('active');
    console.log(attributeLink);
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagsLinks = document.querySelectorAll('.post-tags a');
  console.log(tagsLinks);
  /* START LOOP: for each link */
  for (let tagLink of tagsLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();
