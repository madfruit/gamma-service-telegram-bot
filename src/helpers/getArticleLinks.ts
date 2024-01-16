import {ArticleWithUsers} from "package-types";

export function getArticleLinks(articles: ArticleWithUsers[]): string[] {
    return articles.map(article => {
        return `http://127.0.0.1:3000/articles/${article.id}`;
    });
}

export function getArticleTitles(articles: ArticleWithUsers[]): string {
    let text = '';
    if (articles.length > 0) {
        text = 'На нашому сайті є новини, що стосуються цього об\'єкта. Ось посилання: \n';
        articles.forEach((article, index) => {
            const i = index + 1;
            text += i + ') ' + article.title + '\n';
        });
    }
    return text;
}
