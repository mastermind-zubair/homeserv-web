export function clearLocalStorage() {
  window.localStorage.clear();
}

export function clearGridsCache(arrGrids) {
  if (arrGrids && arrGrids.length > 0) {
    arrGrids.forEach((key) => {
      localStorage.removeItem(key);
    });
  } else {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("dg")) {
        localStorage.removeItem(key);
      }
    });
  }
}

export function clearFiltersCache(arrFilters) {
  if (arrFilters && arrFilters.length > 0) {
    arrFilters.forEach((key) => {
      localStorage.removeItem(key);
    });
  } else {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("filters_")) {
        localStorage.removeItem(key);
      }
    });
  }
}

export function clearReportFilters(gridName) {
  let grid = JSON.parse(window.localStorage.getItem(gridName));
  if (grid && grid.columns.length > 0) {
    grid.columns.forEach((c, index) => {
      delete c.filterValue;
      delete c.filterValues;
    });

    window.localStorage.setItem(gridName, JSON.stringify(grid));
  }
}

export function SetStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function GetStorage(key) {
  let obj = localStorage.getItem(key);
  return obj && JSON.parse(obj);
}

export function RemoveStorage(key) {
  localStorage.removeItem(key);
}
