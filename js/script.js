'use strict';

const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleLinksSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post .post-author',
  authorsListSelector: '.authors.list',
  tagsListSelector: '.tags.list',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-'
};

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
};

function generateTitleLinks(customSelector = '') {
  /* remove content of titleList */
  const titleList = document.querySelector(opt.titleLinksSelector);

  titleList.innerHTML = '';
  /*for each article*/
  const articles = document.querySelectorAll(opt.articleSelector + customSelector);
  console.log(articles);
  let html = '';

  for (let article of articles) {
    /*get the article id*/
    const articleId = article.getAttribute('id');
    /*find the title element and get the title from the title element*/
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
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

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

const calculateTagsParams = function(tags) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');

    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  //calculateTagsParams();
  //liczy klasy od 1 do 5
  return params;
};
const calculateTagClass = function(count, params) {

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opt.cloudClassCount - 1) + 1);

  console.log('class number', classNumber);
  return opt.cloudClassPrefix + classNumber;
};


function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper*/
    const tagsWrapper = article.querySelector(opt.articleTagsSelector);
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
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log(linkHTML);
      /*add generated code to html variable*/
      html = html + linkHTML + ' ';
      console.log(html);
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /*END LOOP: for each tag */
    }
    /* instert HTML of all the links into the tags wrapper*/
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article*/
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opt.tagsListSelector);

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams', tagsParams);

  let allTagsHTML = '';
  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '"href= "' + tag + '">' + tag + '</a>(' + allTags[tag] + ')</li>';
    const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '"href="#tag-' + tag + '">' + tag + '</a></li>';
    //const linkHTML = '<li><a href="#' + '"><span>' + '</span></a></li>';

    allTagsHTML += tagLinkHTML;

    //const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    console.log('tagLinkHTML', tagLinkHTML);
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
  console.log('lista tagow', tagList);
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
  const tagsLinks = document.querySelectorAll('.post-tags a, .tags.list a');
  console.log(tagsLinks);
  /* START LOOP: for each link */
  for (let tagLink of tagsLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const authorWrapper = article.querySelector(opt.articleAuthorSelector);
    console.log(authorWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-author attribute */
    const author = article.getAttribute('data-author');
    console.log(author);
    /*Replace ' ' to '-'*/
    //const author_name = authorTags.replace(' ', '-');
    //console.log(author_name);
    /* generate HTML of the link*/
    const authorLinkHTML = '<a href="#author-' + author + '">' + author + '</a>';
    console.log(authorLinkHTML);
    /*add generated code to html variable*/
    html = html + authorLinkHTML;
    console.log(html);

    /*NEW check if this link is NOT already in allAuthors*/
    if (!allAuthors[author]) {
      /*NEW add genereted code to allAuthors object*/
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    console.log(allAuthors);
    /* insert HTML of all the links into the tags wrapper */
    authorWrapper.innerHTML = 'by' + ' ' + html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(opt.authorsListSelector);
  //console.log(authorList);
  //* [NEW] create variable for all links HTML code */
  let allAuthorsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '"href="#tag-' + tag + '">' + tag + '</a></li>';
    //const authorLinkHTML = '<a href="#author-' + author + '">' + author + '</a>';
    //allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ') </a></li>';
    const linkHTML = '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ') </a></li>';

    allAuthorsHTML += linkHTML;
  }

  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  authorList.innerHTML = allAuthorsHTML;

}
generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Link was clicked');
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  console.log(author);
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(activeAuthorLinks);
  /* START LOOP: for each active tag link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorEqualLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(authorEqualLinks);
  /* START LOOP: for each found tag link */
  for (let authorEqualLink of authorEqualLinks) {
    /* add class active */
    authorEqualLink.classList.add('active');
    console.log(authorEqualLink);
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('.post-author a, .list.authors a');
  console.log(authorLinks);
  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {
    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
