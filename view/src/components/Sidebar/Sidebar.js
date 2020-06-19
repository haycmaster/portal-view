import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  Toc as OrderIcon,
} from "@material-ui/icons";

import AcUnitIcon from '@material-ui/icons/AcUnit';
import LocationCity from '@material-ui/icons/LocationCity';
import EmojiPeople from '@material-ui/icons/EmojiPeople';
import AddAlert from '@material-ui/icons/AddAlert';
import Business from '@material-ui/icons/Business';
import AccountBox from '@material-ui/icons/AccountBox'

import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import { useUserState } from "../../context/UserContext";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const structure = [
  { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  //{ id: 1, label: "OAuth 2.0", role: "user", link: "/app/oauth", icon: <TypographyIcon />,
  { id: 1, label: "OAuth 2.0", link: "/app/oauth", icon: <TypographyIcon />,
      children: [
        { label: "Test Token", link: "/app/oauth/longlived" },
        { label: "Client", link: "/app/oauth/client" },
        { label: "Service", link: "/app/oauth/service" },
      ]
  },
  { id: 2, label: "Marketplace", link: "/app/marketplace", icon: <TableIcon />,
      children: [
        { label: "Restful", link: "/app/restful" },
        { label: "GraphQL", link: "/app/graphql" },
        { label: "Hybrid", link: "/app/hybrid" },
        { label: "Schema Form", link: "/app/schemaform" },
        { label: "JSON Schema", link: "/app/jsonschema" },
      ]
  },
  { id: 3, label: "Notifications", role: "user", link: "/app/notifications", icon: <NotificationsIcon /> },
  { id: 4, label: "News", link: "/app/news", icon: <UIElementsIcon /> },
  { id: 5, label: "Blog", link: "/app/blog", icon: <UIElementsIcon /> },
  { id: 6, label: "Forum", link: "/app/forum", icon: <UIElementsIcon /> },
  { id: 7, label: "Support", link: "/app/support", icon: <SupportIcon /> },
  { id: 8, label: "FAQ", link: "/app/faq", icon: <FAQIcon /> },
  
  { id: 9, type: "divider", role: "orgadm" },
  { id: 10, type: "title", role: "orgadm", label: "ADMIN" },
  { id: 11, label: "Client Admin", role: "orgadm", link: "/app/client/admin", icon: <LibraryIcon />,
    children: [
      { label: "Register", link: "/app/client/register" },
      { label: "Update", link: "/app/client/update" },
      { label: "Delete", link: "/app/client/delete" },
      { label: "Service Request", link: "/app/client/request" },
    ]
  },
  { id: 12, label: "Service Admin", role: "orgadm", link: "/app/service/admin", icon: <LibraryIcon />,
    children: [
      { label: "Register", link: "/app/service/register" },
      { label: "Update", link: "/app/service/update" },
      { label: "Delete", link: "/app/service/delete" },
      { label: "Client Approval", link: "/app/service/approval" },
    ]
  },
  { id: 13, label: "News Admin", role: "orgadm", link: "/app/news/admin", icon: <LibraryIcon />,
    children: [
      { label: "Create", link: "/app/news/create" },
      { label: "Update", link: "/app/news/update" },
      { label: "Delete", link: "/app/news/delete" }
    ]
  },
  { id: 14, label: "Blog Admin", role: "orgadm", link: "/app/blog/admin", icon: <LibraryIcon />,
    children: [
      { label: "Create", link: "/app/blog/create" },
      { label: "Update", link: "/app/blog/update" },
      { label: "Delete", link: "/app/blog/delete" }
    ]
  },
  { id: 15, label: "Forum Admin", role: "orgadm", link: "/app/forum/admin", icon: <LibraryIcon />,
    children: [
      { label: "Create", link: "/app/forum/create" },
      { label: "Update", link: "/app/forum/update" },
      { label: "Delete", link: "/app/forum/delete" }
    ]
  },
  { id: 20, type: "divider" },
  { id: 25, label: "Website", role: "user", link: "/app/covid/publish", icon: <Business/>, },
  { id: 26, label: "Status", role: "user", link: "/app/covid/status", icon: <AddAlert/>, },
  { id: 27, label: "User Id", link: "/app/covid/userId", icon: <AccountBox />},
  { id: 28, label: "Merchant Orders", role: "merchant", link: "/app/merchantOrders", icon: <OrderIcon/>},
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var { roles } = useUserState();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.filter(link => permission(link.role, roles)).map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  function permission(linkRole, userRoles) {
    if(userRoles == null) {
      if(linkRole == null) {
        return true;
      } else {
        return false
      }
    } else {
      if(linkRole == null) {
        return true;
      } else {
        if(userRoles.includes(linkRole)) {
          return true;
        } else {
          return false;
        }       
      }
    }
  }

  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
