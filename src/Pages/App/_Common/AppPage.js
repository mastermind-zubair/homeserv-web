import React from "react";
import { Space } from "antd";
import PageTitle from "./PageTitle";

export const AppPage = ({ children, className = "" }) => (
  <div className={`app-page ${className}`.trim()}>{children}</div>
);

export const PageHeader = ({ title, suffix, actions, children, className = "" }) => (
  <div className={`app-page-header ${className}`.trim()}>
    <div className="app-page-title-block">
      {title || <PageTitle suffix={suffix} />}
      {children}
    </div>
    {actions && <div className="app-page-actions">{actions}</div>}
  </div>
);

export const PageToolbar = ({ children, align = "end", className = "" }) => (
  <div className={`app-page-toolbar app-page-toolbar-${align} ${className}`.trim()}>
    <Space wrap>{children}</Space>
  </div>
);

export const PageSection = ({ title, children, className = "" }) => (
  <section className={`app-page-section ${className}`.trim()}>
    {title && <div className="app-page-section-title">{title}</div>}
    {children}
  </section>
);

export const GridPanel = ({ children, className = "" }) => (
  <div className={`app-grid-panel ${className}`.trim()}>{children}</div>
);

