import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const App = () => {
  const [gridApi, setGridApi] = useState(null);

  const columns = [
    { headerName: "Athlete", field: "athlete", filter: "agTextColumnFilter", cellRenderer: 'Loading' },
    { headerName: "Age", field: "age", filter: "agTextColumnFilter" },
    { headerName: "Country", field: "country", filter: "agTextColumnFilter" },
    { headerName: "Year", field: "year", filter: "agTextColumnFilter" },
    { headerName: "Date", field: 'date', filter: "agTextColumnFilter" },
    { headerName: "Sport", field: 'sport', filter: "agTextColumnFilter" },
    { headerName: "Gold", field: 'gold', filter: "agTextColumnFilter" },
    { headerName: "Silver", field: 'silver', filter: "agTextColumnFilter" },
    { headerName: "Bronze", field: 'bronze', filter: "agTextColumnFilter" },
    { headerName: "Total", field: 'total', filter: "agTextColumnFilter" },
  ]
  const datasource = {
    getRows(params) {
      console.log(JSON.stringify(params, null, 1));
      const { startRow, endRow, filterModel, sortModel } = params
      let url = `http://localhost:3001/olympic?`
      //Sorting 
      if (sortModel.length) {
        const { colId, sort } = sortModel[0]
        url += `_sort=${colId}&_order=${sort}&`
      }
      //Filtering 
      const filterKeys = Object.keys(filterModel)
      filterKeys.forEach(filter => {
        url += `${filter}=${filterModel[filter].filter}&`
      })
      //Pagination 
      url += `_start=${startRow}&_end=${endRow}`
      fetch(url)
        .then(httpResponse => httpResponse.json())
        .then(response => {
          params.successCallback(response, 499);
        })
        .catch(error => {
          console.error(error);
          params.failCallback();
        })
    }
  };

  const onGridReady = (params) => {
    setGridApi(params);
    // register datasource with the grid 
    params.api.setDatasource(datasource);
  }


  const components = {
    Loading: (params) => {
      if (params.value !== undefined) {
        return params.value
      } else {
        return "Loading .. "
      }
    }
  }

  return (
    <div>
      <h1 align="center">Trial Scroll</h1>
      <div className="ag-theme-alpine" style={{ height: 800 }}>
        <AgGridReact
          columnDefs={columns}
          // pagination={true} 
          // paginationPageSize={8} 
          // domLayout="autoHeight" 
          components={components}
          rowModelType="infinite"
          onGridReady={onGridReady}

          cacheBlockSize={20}


        // defaultColDef={{ filter: true, floatingFilter: true, sortable: true }} 
        />
      </div>
    </div>
  );
};
export default App 