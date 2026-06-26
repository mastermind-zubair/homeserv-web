import _ from "lodash";
import React from "react";
import { Route } from "react-router-dom";
import AuthService from "Services/AuthService";

export const ProtectedRoute = ({ i, path, component: Component, render, ...rest }) => {
  //console.log("Protected Route");
  return (
    <Route
      key={i}
      exact={true}
      path={path}
      render={(props) => {
        if (!AuthService.isLoggedIn()) {
          // return (
          //   <Redirect
          //     to={{
          //       pathname: "/session-expired",
          //       state: { from: props.location },
          //     }}
          //   />
          // );
          //props.history.push("/session-expired");
          window.location.href = "/session-expired";
        }
        return Component ? <Component {...props} /> : render(props);
      }}
      {...rest}
    />
  );
};

export const AdminRoute = ({ key, path, component: Component, render, ...rest }) => {
  return (
    <Route
      key={key}
      path={path}
      render={(props) => {
        if (!AuthService.isAdmin()) {
          //return (
          // <Redirect
          //   to={{
          //     pathname: "/login",
          //     state: { from: props.location },
          //     key: "-1",
          //     search: "?type=restricted&role=admin",
          //   }}
          // />
          window.location.href = "/session-expired";
          //);
        }
        return Component ? <Component {...props} /> : render(props);
      }}
      {...rest}
    />
  );
};

export const doWait = (ms) => {
  //pass a time in milliseconds to this function
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getLookupDataSource = (data, labelField, valueField, fk) => {
  if (labelField.indexOf("{") >= 0) {
    //it's a template label field
    data = data.map((d) => {
      const regex = /{(.*?)}/g;
      let m;
      let label = labelField;

      while ((m = regex.exec(labelField)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        label = label.replace(m[0], d[m[1]]);
      }
      return { ...d, label };
    });
    labelField = "label";
  }

  const result =
    data &&
    data.map((d) => {
      return { label: labelField ? d[labelField] : d, value: valueField ? d[valueField] : d, fk: (fk && d[fk]) || "" };
    });
  return result;
};

export function getLookupTree(data, valueField, labelField, childrenField) {
  let tree =
    (data &&
      data.map((d) => {
        return getNode(d, valueField, labelField, childrenField);
      })) ||
    [];

  return tree;
}
export function getNode(parent, valueField, labelField, childrenField) {
  let node = {
    value: parent[valueField],
    label: parent[labelField],
  };

  node.children = [];
  if (parent[childrenField] && parent[childrenField].length > 0) {
    node.children = parent[childrenField].map((c) => {
      return getNode(c, valueField, labelField, childrenField);
    });
  }

  return node;
}

export const filterByMultipleIds = (data, filterField, ids) => {
  //checkedIds = v;
  // var result = _.filter(data, function (d) {
  //   return _.includes(ids, d[filterField]);
  // });

  var result = data.filter((e) => ids.includes(e[filterField]));

  console.log(result);
  return result;
};
