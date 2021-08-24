const map = require("lodash/map");

class DomService {
  tagsForSearch = ["a", "span", "p", "div"];

  getParentSelector(node, sameQueries) {
    let parentClasses = null;

    if (!node) return null;
    if (!node.parentNode) {
      parentClasses = node.classList.value;
    }

    if (node.parentNode.classList.length > 0 && sameQueries.length === 0) {
      parentClasses = node.parentNode.classList.value;
    } else {
      parentClasses = this.getParentRecursion(node.parentNode, sameQueries, 10);
    }

    return parentClasses?.length > 0
      ? this.transformClassesToSelector(parentClasses)
      : null;
  }

  getParentRecursion(tag, sameQueries, findParentTry = 0) {
    if (findParentTry === 0) {
      return null;
    }
    if (!tag) return null;

    const firstParent = tag.parentNode;
    if (!firstParent) return tag.classList.value;

    const sameNodesFounded = map(sameQueries, (query) =>
      this.getNodeByText(firstParent, query)
    );

    const isCommonParent = !sameNodesFounded.some((node) => !node);

    if (firstParent.classList.value.length > 0 && isCommonParent) {
      return firstParent.classList.value;
    } else {
      return this.getParentRecursion(
        firstParent,
        sameQueries,
        findParentTry - 1
      );
    }
  }

  transformClassesToSelector(classList) {
    if (!classList?.length) return null;
    return `.${classList.join(".")}`;
  }

  getNodeByText(nodeForSearch, searchText) {
    let node = null;

    this.tagsForSearch.forEach((tagName) => {
      if (node) return;
      const parsedTagsFromDom = nodeForSearch.querySelectorAll(tagName);

      parsedTagsFromDom.forEach((tag) => {
        if (node) return;

        if (tag.textContent.includes(searchText)) {
          node = tag;
        }
      });
    });

    return node;
  }
  getTextsByNodes(nodes) {
    return nodes.map((item) => item.textContent.replace(/\s+/g, " ").trim());
  }

  getNodeSelector(node, tryCount = 10) {
    if (!node?.classList?.value || tryCount === 0) return null;

    if (node.classList?.value?.length > 0) {
      return this.transformClassesToSelector(node.classList.value);
    } else {
      return this.getNodeSelector(node.parentNode, tryCount - 1);
    }
  }
}

module.exports = new DomService();
