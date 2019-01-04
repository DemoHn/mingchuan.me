<script>
import { Layout, Menu, Icon } from "ant-design-vue";
import _ from "lodash";
const { Sider, Content } = Layout;
import adminMenuData from "./menu-config.json";

// UI logic
const $source = adminMenuData;

const mapMenuItems = (h, parentKey) => item => {
  const $key = parentKey ? parentKey + "$" + item.key : item.key;
  if (item.children && item.children.length > 0) {
    return (
      <a-sub-menu key={$key}>
        <span slot="title">
          {item.icon ? <a-icon type={item.icon} /> : null}
          <span>{item.name}</span>
        </span>
        {item.children.map(mapMenuItems(h, $key))}
      </a-sub-menu>
    );
  } else {
    return (
      <a-menu-item key={$key}>
        <nuxt-link to={item.path}>
          {item.icon ? <a-icon type={item.icon} /> : null}
          <span>{item.name}</span>
        </nuxt-link>
      </a-menu-item>
    );
  }
};

// <AdminMenuList /> component
const AdminMenuList = {
  props: {
    defaultSelectedKeys: {
      type: Array
    },
    defaultOpenKeys: {
      type: Array
    }
  },
  components: {
    [Icon.name]: Icon,
    [Menu.name]: Menu,
    aMenuItem: Menu.Item,
    aSubMenu: Menu.SubMenu
  },
  render(h) {
    return (
      <a-menu
        mode="inline"
        theme="light"
        style="height: 100%"
        inlineCollapsed={false}
        defaultSelectedKeys={this.defaultSelectedKeys}
        defaultOpenKeys={this.defaultOpenKeys}
      >
        {$source.map(mapMenuItems(h))}
      </a-menu>
    );
  }
};

const AdminMenu = {
  name: "adminMenu",
  props: {
    defaultKeys: Object
  },
  computed: {
    defaultOpenKeys() {
      return _.get(this.defaultKeys, "defaultOpenKeys") || [];
    },
    defaultSelectedKeys() {
      return _.get(this.defaultKeys, "defaultSelectedKeys") || [];
    }
  },
  components: {
    AdminMenuList: AdminMenuList,
    [Layout.name]: Layout,
    [Sider.name]: Sider,
    [Content.name]: Content,

    [Menu.name]: Menu,
    aMenuItem: Menu.Item,
    aSubMenu: Menu.SubMenu
  },
  render(h) {
    return (
      <a-layout class="m-container" hasSider={true}>
        <a-layout-sider class="sider" width={200}>
          <admin-menu-list
            defaultOpenKeys={this.defaultOpenKeys}
            defaultSelectedKeys={this.defaultSelectedKeys}
          />
        </a-layout-sider>
        <a-layout-content>{this.$slots.default}</a-layout-content>
      </a-layout>
    );
  }
};

export default AdminMenu;
</script>

<style lang="less" scoped>
.m-container {
  background-color: white;
  display: flex;
}
.sider {
  margin-right: 2rem;
  background-color: white;
}
</style>
