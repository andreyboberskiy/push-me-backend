const map = require("lodash/map");
const { filter, forEach } = require("lodash");

class DomService {
  tagsForSearch = ["a", "span", "p", "div"];

  getParentSelector({ node, selector, currentNodeText, tryCount = 0 }) {
    let parentClasses = null;
    if (!node || tryCount > 10) return null;
    if (!node.parentNode) {
      parentClasses = node.classList.value;
    }

    if (parentClasses) {
      return this.transformClassesToSelector(parentClasses);
    }
    let sameNodeText = null;

    const suspectParentNode = node.parentNode;

    const suspectParentNodeSelector =
      this.getNodeClassesSelector(suspectParentNode);

    let suspectParentNodeNeighbors = [];

    if (suspectParentNodeSelector) {
      suspectParentNodeNeighbors =
        suspectParentNode?.parentNode?.querySelectorAll(
          suspectParentNodeSelector
        );
    }

    forEach(suspectParentNodeNeighbors, (node) => {
      if (sameNodeText) return;

      if (node && node["querySelector"]) {
        const sameNode = node.querySelector(selector);

        const suspectSameNodeText = this.getTextByNode(sameNode);
        if (sameNode && !suspectSameNodeText.includes(currentNodeText)) {
          sameNodeText = suspectSameNodeText;
        }
      }
    });

    if (sameNodeText) {
      return this.getNodeClassesSelector(suspectParentNode);
    } else {
      return this.getParentSelector({
        node: suspectParentNode,
        selector,
        currentNodeText,
        tryCount: tryCount + 1,
      });
    }
  }

  transformClassesToSelector(classList) {
    if (!classList?.length) return null;

    const validClassList = filter(
      classList,
      (className) => className.length > 0
    );
    return `.${validClassList.join(".")}`;
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

  getTextByNode(node) {
    return node.textContent.replace(/\s+/g, " ").trim();
  }

  getNodeClassesSelectorUpper(node, tryCount = 10) {
    if (!node?.classList?.value || tryCount === 0) return null;

    if (node.classList?.value?.length > 0) {
      return this.transformClassesToSelector(node.classList.value);
    } else {
      return this.getNodeClassesSelectorUpper(node.parentNode, tryCount - 1);
    }
  }

  getNodeClassesSelector(node) {
    if (!node?.classList?.value) return null;
    return this.transformClassesToSelector(node.classList.value);
  }
}

module.exports = new DomService();
