import adminMenuData from "~/components/admin/menu-config.json";

// get default keys for AdminMenu UI
function findMenuKey($root, elemArr, index) {
  if (index >= elemArr.length) {
    return false;
  }

  for (var i = 0; i < $root.length; i++) {
    const $elem = $root[i];
    if ($elem.key === elemArr[index]) {
      if (index === elemArr.length - 1) {
        return true;
      } else if ($elem.children && $elem.children.length > 0) {
        const nIndex = index + 1;
        return findMenuKey($elem.children, elemArr, nIndex);
      }
    }
  }

  return false;
}

export function getDefaultKeys(context) {
  const { route, store } = context;
  const path = route.path;

  const elems = path.split("/");
  // to shift out '', 'admin'
  elems.shift();
  elems.shift();

  // ensure key could be find in `adminMenuKeys`
  const foundKey = findMenuKey(adminMenuData, elems, 0);
  if (foundKey) {
    const selectedKey = elems.join("$");
    const openKeys = [];
    elems.forEach((item, index) => {
      // not add last key
      if (index < elems.length - 1) {
        if (openKeys.length > 0) {
          const lastKey = openKeys[openKeys.length - 1];
          openKeys.push(lastKey + "$" + item);
        } else {
          openKeys.push(item);
        }
      }
    });

    return {
      defaultOpenKeys: openKeys,
      defaultSelectedKeys: [selectedKey]
    };
  }
  // if keys not found, then return empty array
  return {
    defaultOpenKeys: [],
    defaultSelectedKeys: []
  };
}
