'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML)
}

const opts = {
  cloud: {
    classCount: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a.active[href^="#tag-"]',
      authors: 'a.active[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
    title: '.post-title',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
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
  const titleList = document.querySelector(select.listOf.titles);

  titleList.innerHTML = '';
  /*for each article*/
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  console.log(articles);
  let html = '';

  for (let article of articles) {
    /*get the article id*/
    const articleId = article.getAttribute('id');
    /*find the title element and get the title from the title element*/
    const articleTitle = article.querySelector(select.article.title).innerHTML;
    /*create HTML of the link*/
    const linkHTMLData = {
      id: articleId,
      title: articleTitle
    };
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);
    /*insert link into titleList*/
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
  return params;
};
const calculateTagClass = function(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloud.classCount - 1) + 1);

  console.log('class number', classNumber);
  return opts.cloud.classPrefix + classNumber;
};

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper*/
    const tagsWrapper = article.querySelector(select.article.tags);
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
      const linkHTMLData = {
        id: tag,
        title: tag
      };
      const linkHTML = templates.articleTag(linkHTMLData);
      console.warn(linkHTML);
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
  const tagList = document.querySelector(select.listOf.tags);
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams', tagsParams);
  //let allTagsHTML = '';
  const allTagsData = {
    tags: []
  };
  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    /* [NEW] END LOOP: for each tag in allTags: */
  }
  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  //console.log('sprawdzenie', allTagsData);
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
  const activeLinksTags = document.querySelectorAll(select.all.linksTo.tags);
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
  const articles = document.querySelectorAll(select.all.articles);
  console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const authorWrapper = article.querySelector(select.article.author);
    console.log(authorWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-author attribute */
    const author = article.getAttribute('data-author');
    console.log(author);
    /* generate HTML of the link*/
    const linkHTMLData = {
      id: author,
      title: author
    };
    const linkHTMLAuthor = templates.articleAuthor(linkHTMLData);
    console.log(linkHTMLAuthor);
    /*add generated code to html variable*/
    html = html + linkHTMLAuthor;
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
  const authorList = document.querySelector(select.listOf.authors);
  //* [NEW] create variable for all links HTML code */
  const allAuthorData = {
    authors: []
  };
  /* [NEW] START LOOP: for each tag in allTags: */
  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allAuthorData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  /* [NEW] END LOOP: for each tag in allTags: */
  }
  console.log(allAuthorData);
  /*[NEW] add HTML from allTagsHTML to tagList */
  authorList.innerHTML = templates.authorLink(allAuthorData);
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
  const activeAuthorLinks = document.querySelectorAll(select.all.linksTo.authors);
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
