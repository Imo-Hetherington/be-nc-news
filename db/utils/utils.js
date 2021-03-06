exports.formatDates = list => {
  const newList = list.map(object => {
    let objectCopy = { ...object };
    objectCopy.created_at = new Date(object.created_at);
    return objectCopy;
  });

  return newList;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map(
    ({ belongs_to, created_by, ...props }) => {
      return {
        article_id: articleRef[belongs_to],
        author: created_by,
        ...props
      };
    }
  );
  return formattedComments;
};
