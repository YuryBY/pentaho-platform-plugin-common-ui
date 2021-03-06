/*!
* Copyright 2010 - 2015 Pentaho Corporation.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*/
define(["common-ui/vizapi/data/DataTable"], function(DataTable) {

  function getDatasetCDA1() {
    return {
      metadata: [
        {colName: "country", colType: "STRING",  colLabel: "Country"},
        {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
      ],
      resultset: [
        ["Portugal", 12000],
        ["Ireland",   6000]
      ]
    };
  }

  function getDatasetDT1() {
    return {
      cols: [
        {id: "country", type: "string", label: "Country"},
        {id: "sales",   type: "number", label: "Sales"  },
      ],
      rows: [
        {c: [ {v: "Portugal"}, {v: 12000}] },
        {c: [ {v: "Ireland" }, {v:  6000}] }
      ]
    };
  }

  function getDatasetDT1Normalized() {
    return {
      cols: [
        {id: "country", type: "string", label: "Country"},
        {id: "sales",   type: "number", label: "Sales"  },
      ],
      rows: [
        {c: [ {v: "Portugal", f: null}, {v: 12000, f: null}] },
        {c: [ {v: "Ireland",  f: null}, {v:  6000, f: null}] }
      ]
    };
  }

  describe("DataTable -", function() {
    it("should be a function", function() {
      expect(typeof DataTable).toBe("function");
    });

    describe("#new() -", function() {

      describe("with no arguments -", function() {

        it("should return an instance of DataTable", function() {
          var dataTable = new DataTable();
          expect(dataTable instanceof DataTable).toBe(true);
        });

        it("should return a data table with 0 columns", function() {
          var dataTable = new DataTable();
          expect(dataTable.getNumberOfColumns()).toBe(0);
        });

        it("should return a data table with 0 rows", function() {
          var dataTable = new DataTable();
          expect(dataTable.getNumberOfRows()).toBe(0);
        });
      });

      describe("with one argument, a plain JavaScript object in DataTable format -", function() {
        var jsTable;

        beforeEach(function() { jsTable = getDatasetDT1(); });

        it("should return an instance of DataTable", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable instanceof DataTable).toBe(true);
        });

        it("should return a data table with 2 columns", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable.getNumberOfColumns()).toBe(2);
        });

        it("should return a data table with 2 rows", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable.getNumberOfRows()).toBe(2);
        });

        it("should return a data table whose internal _jsonTable is the specified object", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable._jsonTable).toBe(jsTable);
        });
      });

      describe("with one argument, a plain JavaScript object in CDA format -", function() {
        var jsTable;

        beforeEach(function() { jsTable = getDatasetCDA1(); });

        it("should return an instance of DataTable", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable instanceof DataTable).toBe(true);
        });

        it("should return a data table whose internal _jsonTable is not the specified object", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable._jsonTable instanceof Object).toBe(true);
          expect(dataTable._jsonTable).not.toBe(jsTable);
        });

        it("should return a data table with 2 columns", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable.getNumberOfColumns()).toBe(2);
        });

        it("should return a data table with 2 rows", function() {
          var dataTable = new DataTable(jsTable);
          expect(dataTable.getNumberOfRows()).toBe(2);
        });
      });

      // Exercizes toJSON, really.
      describe("with one argument, another DataTable -", function() {
        var sourceDataTable;

        beforeEach(function() { sourceDataTable = new DataTable(getDatasetDT1Normalized()); });

        it("should return a different instance of DataTable", function() {
          var dataTable = new DataTable(sourceDataTable);
          expect(dataTable instanceof DataTable).toBe(true);
          expect(dataTable).not.toBe(sourceDataTable);
        });

        it("should return a data table whose internal _jsonTable is not that of the source data table", function() {
          var dataTable = new DataTable(sourceDataTable);
          expect(dataTable._jsonTable).not.toBe(sourceDataTable._jsonTable);
        });

        it("should return a data table having the same data as the source data table", function() {
          var dataTable = new DataTable(sourceDataTable);
          expect(dataTable._jsonTable).toEqual(sourceDataTable._jsonTable);
        });
      });
    });

    describe("table -", function() {
      describe("#convertCdaToDataTable() -", function() {
        var jsTable;

        beforeEach(function() {
          jsTable = DataTable.convertCdaToDataTable(getDatasetCDA1());
        });

        it("should return an Object", function() {
          expect(jsTable instanceof Object).toBe(true);
        });

        it("should return a data table with the expected metadata and data", function() {
          expect(jsTable).toEqual(getDatasetDT1Normalized());
        });
      });

      // This is actually implemented in the abstract base class AbstractDataTable
      describe("#toJSON() -", function() {
        var dataTable;

        beforeEach(function() {
          dataTable = new DataTable(getDatasetDT1());
        });

        it("should return a plain JavaScript Object", function() {
          var jsTable = dataTable.toJSON();
          expect(jsTable instanceof Object).toBe(true);
        });

        it("should return an object with the same metadata and data", function() {
          var jsTable = dataTable.toJSON();
          expect(jsTable).toEqual(getDatasetDT1Normalized());
        });

        it("should return an object having distinct col, row and cell objects from those of the source data table", function() {
          var jsTable = dataTable.toJSON();

          expect(jsTable.cols[0]).not.toBe(dataTable._jsonTable.cols[0]);
          expect(jsTable.cols[1]).not.toBe(dataTable._jsonTable.cols[1]);

          expect(jsTable.rows[0]).not.toBe(dataTable._jsonTable.rows[0]);
          expect(jsTable.rows[0].c[0]).not.toBe(dataTable._jsonTable.rows[0].c[0]);
          expect(jsTable.rows[0].c[1]).not.toBe(dataTable._jsonTable.rows[0].c[1]);

          expect(jsTable.rows[1]).not.toBe(dataTable._jsonTable.rows[1]);
          expect(jsTable.rows[1].c[0]).not.toBe(dataTable._jsonTable.rows[1].c[0]);
          expect(jsTable.rows[1].c[1]).not.toBe(dataTable._jsonTable.rows[1].c[1]);
        });
      });

      describe("#getJsonTable() -", function() {
        it("should return the internal plain JavaScript object in DataTable format", function() {
          var dataTable = new DataTable(getDatasetDT1());
          expect(dataTable._jsonTable).toBe(dataTable.getJsonTable());
        });
      });
    });

    describe("columns -", function() {

      describe("#getNumberOfColumns() -", function() {
        it("should return 0 when there are no columns", function() {
          var dataTable = new DataTable();
          expect(dataTable.getNumberOfColumns()).toBe(0);
        });

        it("should return 3 when there are 3 columns", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "string"},
              {id: "B", type: "number"},
              {id: "C", type: "boolean"}
            ],
            rows: []
          });
          expect(dataTable.getNumberOfColumns()).toBe(3);
        });
      });

      describe("#getColumnType() -", function() {
        it("should return the column type of the given column index", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "string"},
              {id: "B", type: "number"},
              {id: "C", type: "boolean"}
            ],
            rows: []
          });

          expect(dataTable.getColumnType(0)).toBe("string");
          expect(dataTable.getColumnType(1)).toBe("number");
          expect(dataTable.getColumnType(2)).toBe("boolean");
        });

        it("should return the column type as lower case", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "STRING"},
              {id: "B", type: "NUMBER"},
              {id: "C", type: "BOOLEAN"}
            ],
            rows: []
          });

          expect(dataTable.getColumnType(0)).toBe("string");
          expect(dataTable.getColumnType(1)).toBe("number");
          expect(dataTable.getColumnType(2)).toBe("boolean");
        });

        it("should return unknown column types", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "GUGU"},
              {id: "B", type: "DADA"}
            ],
            rows: []
          });

          expect(dataTable.getColumnType(0)).toBe("gugu");
          expect(dataTable.getColumnType(1)).toBe("dada");
        });

        it("should return the column type 'string' as default", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: null},
              {id: "B", type: undefined},
              {id: "C", type: ""},
              {id: "D"}
            ],
            rows: []
          });

          expect(dataTable.getColumnType(0)).toBe("string");
          expect(dataTable.getColumnType(1)).toBe("string");
          expect(dataTable.getColumnType(2)).toBe("string");
          expect(dataTable.getColumnType(3)).toBe("string");
        });
      });

      describe("#getColumnId() -", function() {
        it("should return the column id of the given column index", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A" },
              {id: "Bc"},
              {id: "dE"}
            ],
            rows: []
          });

          expect(dataTable.getColumnId(0)).toBe("A");
          expect(dataTable.getColumnId(1)).toBe("Bc");
          expect(dataTable.getColumnId(2)).toBe("dE");
        });
      });

      describe("#getColumnLabel() -", function() {
        it("should return the column label of the given column index", function() {
          var dataTable = new DataTable({
            cols: [
              {label: "ABC"},
              {label: "DEF"},
              {label: "GHI"}
            ],
            rows: []
          });

          expect(dataTable.getColumnLabel(0)).toBe("ABC");
          expect(dataTable.getColumnLabel(1)).toBe("DEF");
          expect(dataTable.getColumnLabel(2)).toBe("GHI");
        });
      });

      describe("#getColumnProperty() -", function() {
        it("should return the value of the specified column property", function() {
          var foo = {},
              bar = {},
              dataTable = new DataTable({
            cols: [
              {foo: foo},
              {bar: bar}
            ],
            rows: []
          });

          expect(dataTable.getColumnProperty(0, "foo")).toBe(foo);
          expect(dataTable.getColumnProperty(1, "bar")).toBe(bar);
        });

        it("should return `undefined` for a column property which is not defined", function() {
          var dataTable = new DataTable({
            cols: [
              {}
            ]
          });

          expect(dataTable.getColumnProperty(0, "foo")).toBeUndefined();
        });
      });

      describe("#setColumnProperty() -", function() {
        it("should set the value of the specified column property", function() {
          var foo = {},
              bar = {},
              dataTable = new DataTable({
            cols: [
              {},
              {}
            ],
            rows: []
          });

          dataTable.setColumnProperty(0, "foo", foo);
          dataTable.setColumnProperty(1, "bar", bar);

          expect(dataTable.getColumnProperty(0, "foo")).toBe(foo);
          expect(dataTable.getColumnProperty(1, "bar")).toBe(bar);
        });
      });

      describe("#getColumnRange() -", function() {
        it("should return a range object with both min and max `undefined` when there is no data", function() {

          var dataTable = new DataTable({
            metadata: [
              {colName: "country", colType: "STRING",  colLabel: "Country"},
              {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
            ],
            resultset: []
          });

          expect(dataTable.getColumnRange(1)).toEqual({min: undefined, max: undefined});
        });

        it("should return a range object with both min and max `undefined` " +
           "when all data of the specified column is `null`, `undefined` or `NaN`", function() {

          var dataTable = new DataTable({
            metadata: [
              {colName: "country", colType: "STRING",  colLabel: "Country"},
              {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
            ],
            resultset: [
              ["Portugal", null],
              ["Ireland",  undefined],
              ["France",   NaN]
            ]
          });

          expect(dataTable.getColumnRange(1)).toEqual({min: undefined, max: undefined});
        });

        it("should return a range object with an equal defined value " +
           "when only one row of the specified column is not `null`, `undefined` or `NaN`", function() {

          var dataTable = new DataTable({
            metadata: [
              {colName: "country", colType: "STRING",  colLabel: "Country"},
              {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
            ],
            resultset: [
              ["Portugal", null],
              ["Ireland",  undefined],
              ["Italy",    100],
              ["France",   NaN]
            ]
          });

          expect(dataTable.getColumnRange(1)).toEqual({min: 100, max: 100});
        });

        it("should return a range object with the min and max values of the specified column", function() {

          var dataTable = new DataTable({
            metadata: [
              {colName: "country", colType: "STRING",  colLabel: "Country"},
              {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  },
              {colName: "qty",     colType: "NUMERIC", colLabel: "Qty"    }
            ],
            resultset: [
              ["Portugal", 100,  -1],
              ["Ireland",  200,   6],
              ["Italy",    100,   3],
              ["France",   1000, -3]
            ]
          });

          expect(dataTable.getColumnRange(0)).toEqual({min: "France", max: "Portugal"});
          expect(dataTable.getColumnRange(1)).toEqual({min: 100, max: 1000});
          expect(dataTable.getColumnRange(2)).toEqual({min: -3, max: 6});
        });
      });

      describe("#getDistinctValues() -", function() {

        it("should return an empty array when there is no data", function() {

          var dataTable = new DataTable({
            metadata: [
              {colName: "country", colType: "STRING",  colLabel: "Country"},
              {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
            ],
            resultset: []
          });

          expect(dataTable.getDistinctValues(1)).toEqual([]);
        });

        it("should return an array containing all values present in the specified column", function() {

          var values = [12000, 6000, 24000],
              dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",   24000],
                  ["Italy",    12000]
                ]
              });

          var valuesMap = {};
          dataTable
            .getDistinctValues(1)
            .forEach(function(v) { valuesMap[v] = 1; });

          values.forEach(function(v) {
              expect(valuesMap[v]).toBe(1);
          });
        });

        it("should return an array containing only values present in the specified column", function() {

          var values = [12000, 6000, 24000],
              dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",   24000],
                  ["Italy",    12000]
                ]
              });

          dataTable
            .getDistinctValues(1)
            .forEach(function(v) {
              expect(values.indexOf(v) >= 0).toBe(true);
            });
        });

        it("should return an array containing only the distinct values present in the specified column", function() {

          var values = [12000, 6000, 24000],
              dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",   24000],
                  ["Italy",    12000]
                ]
              }),
              valuesMap = {};

          dataTable
            .getDistinctValues(1)
            .forEach(function(v) {
              if(values.indexOf(v) >= 0) {
                expect(valuesMap[v]).not.toBe(1);
                valuesMap[v] = 1;
              }
            });
        });

        it("should return an array containing values in the order of occurrence in the specified column", function() {
          var values = [12000, 6000, 24000],
              dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",   24000],
                  ["Italy",    12000]
                ]
              }),
              distinctValues = dataTable.getDistinctValues(1);

          for(var i = 0; i < distinctValues.length - 1; i++) {
            expect(values.indexOf(distinctValues[i    ])
                   <=
                   values.indexOf(distinctValues[i + 1]))
              .toBe(true);
          }
        });

        it("should return an array containing a single `null` value when the specified column contains `null` or `undefined` values", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   undefined],
                  ["France",    null],
                  ["Italy",     2000],
                  ["Greece",    null]
                ]
              }),
              distinctValues = dataTable.getDistinctValues(1);

          expect(distinctValues.filter(function(v) { return v === null; }).length).toBe(1);
        });

        it("should return an array containing a single `NaN` value when the specified column contains `NaN` values", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",     NaN],
                  ["Italy",      NaN]
                ]
              }),
              distinctValues = dataTable.getDistinctValues(1);

          expect(distinctValues.filter(function(v) { return isNaN(v); }).length).toBe(1);
        });

        it("should support string columns", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",   24000],
                  ["Portugal", 12000]
                ]
              }),
              distinctValues = dataTable.getDistinctValues(0);

          expect(distinctValues).toEqual(["Portugal", "Ireland", "France"]);
        });

        it("should support boolean columns", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "string",  colLabel: "Country"},
                  {colName: "euro",    colType: "boolean", colLabel: "Euro"   }
                ],
                resultset: [
                  ["Portugal", true],
                  ["Ireland",  true],
                  ["France",   true],
                  ["UK",       false]
                ]
              }),
              distinctValues = dataTable.getDistinctValues(1);

          expect(distinctValues).toEqual([true, false]);
        });

        it("should return an array containing distinct `null` and `\"null\"` values, when the specified column contains both", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  [null,        6000],
                  ["null",       500],
                  ["Italy",    12000]
                ]
              }),
              distinctValues = dataTable.getDistinctValues(0);

          expect(distinctValues).toEqual(["Portugal", null, "null", "Italy"]);
        });
      });

      describe("#getDistinctFormattedValues() -", function() {

        it("should return an empty array when there is no data", function() {

          var dataTable = new DataTable({
            metadata: [
              {colName: "country", colType: "STRING",  colLabel: "Country"},
              {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
            ],
            resultset: []
          });

          expect(dataTable.getDistinctFormattedValues(1)).toEqual([]);
        });

        it("should return an array containing all formatted values present in the specified column", function() {

          var values = ["1.2", "0.6", "2.4"],
              dataTable = new DataTable({
                cols: [
                  {id: "country", type: "STRING", label: "Country"},
                  {id: "sales",   type: "NUMBER", label: "Sales"  }
                ],
                rows: [
                  {c: ["Portugal", {v: 12000, f: "1.2"}]},
                  {c: ["Ireland",  {v:  6000, f: "0.6"}]},
                  {c: ["France",   {v: 24000, f: "2.4"}]},
                  {c: ["Italy",    {v: 11000, f: "1.2"}]}
                ]
              });

          var valuesMap = {};
          dataTable
            .getDistinctFormattedValues(1)
            .forEach(function(v) { valuesMap[v] = 1; });

          values.forEach(function(v) {
              expect(valuesMap[v]).toBe(1);
          });
        });

        it("should return an array containing only formatted values present in the specified column", function() {

          var values = ["1.2", "0.6", "2.4"],
              dataTable = new DataTable({
                cols: [
                  {id: "country", type: "STRING", label: "Country"},
                  {id: "sales",   type: "NUMBER", label: "Sales"  }
                ],
                rows: [
                  {c: ["Portugal", {v: 12000, f: "1.2"}]},
                  {c: ["Ireland",  {v:  6000, f: "0.6"}]},
                  {c: ["France",   {v: 24000, f: "2.4"}]},
                  {c: ["Italy",    {v: 11000, f: "1.2"}]}
                ]
              });

          dataTable
            .getDistinctFormattedValues(1)
            .forEach(function(v) {
              expect(values.indexOf(v) >= 0).toBe(true);
            });
        });

        it("should return an array containing only the distinct formatted values present in the specified column", function() {

          var values = ["1.2", "0.6", "2.4"],
              dataTable = new DataTable({
                cols: [
                  {id: "country", type: "STRING", label: "Country"},
                  {id: "sales",   type: "NUMBER", label: "Sales"  }
                ],
                rows: [
                  {c: ["Portugal", {v: 12000, f: "1.2"}]},
                  {c: ["Ireland",  {v:  6000, f: "0.6"}]},
                  {c: ["France",   {v: 24000, f: "2.4"}]},
                  {c: ["Italy",    {v: 11000, f: "1.2"}]}
                ]
              }),
              valuesMap = {};

          dataTable
            .getDistinctFormattedValues(1)
            .forEach(function(v) {
              if(values.indexOf(v) >= 0) {
                expect(valuesMap[v]).not.toBe(1);
                valuesMap[v] = 1;
              }
            });
        });

        it("should return an array containing formatted values in the order of occurrence in the specified column", function() {
          var values = ["1.2", "0.6", "2.4"],
              dataTable = new DataTable({
                cols: [
                  {id: "country", type: "STRING", label: "Country"},
                  {id: "sales",   type: "NUMBER", label: "Sales"  }
                ],
                rows: [
                  {c: ["Portugal", {v: 12000, f: "1.2"}]},
                  {c: ["Ireland",  {v:  6000, f: "0.6"}]},
                  {c: ["France",   {v: 24000, f: "2.4"}]},
                  {c: ["Italy",    {v: 11000, f: "1.2"}]}
                ]
              }),
              distinctValues = dataTable.getDistinctFormattedValues(1);

          for(var i = 0; i < distinctValues.length - 1; i++) {
            expect(values.indexOf(distinctValues[i    ])
                   <=
                   values.indexOf(distinctValues[i + 1]))
              .toBe(true);
          }
        });

        it("should return an array containing a single `null` value when the specified column contains `null` or `undefined` values", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   undefined],
                  ["France",    null],
                  ["Italy",     2000],
                  ["Greece",    null]
                ]
              }),
              distinctValues = dataTable.getDistinctFormattedValues(1);

          expect(distinctValues.filter(function(v) { return v === null; }).length).toBe(1);
        });

        it("should return an array containing a single `NaN` value when the specified column contains `NaN` values", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",     NaN],
                  ["Italy",      NaN]
                ]
              }),
              distinctValues = dataTable.getDistinctFormattedValues(1);

          expect(distinctValues.filter(function(v) { return isNaN(v); }).length).toBe(1);
        });

        it("should support string columns", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  ["Ireland",   6000],
                  ["France",   24000],
                  ["Portugal", 12000]
                ]
              }),
              distinctValues = dataTable.getDistinctFormattedValues(0);

          expect(distinctValues).toEqual(["Portugal", "Ireland", "France"]);
        });

        it("should support boolean columns", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "string",  colLabel: "Country"},
                  {colName: "euro",    colType: "boolean", colLabel: "Euro"   }
                ],
                resultset: [
                  ["Portugal", true],
                  ["Ireland",  true],
                  ["France",   true],
                  ["UK",       false]
                ]
              }),
              distinctValues = dataTable.getDistinctFormattedValues(1);

          expect(distinctValues).toEqual(["true", "false"]);
        });

        it("should return an array containing distinct `null` and `\"null\"` values, when the specified column contains both", function() {
          var dataTable = new DataTable({
                metadata: [
                  {colName: "country", colType: "STRING",  colLabel: "Country"},
                  {colName: "sales",   colType: "NUMERIC", colLabel: "Sales"  }
                ],
                resultset: [
                  ["Portugal", 12000],
                  [null,        6000],
                  ["null",       500],
                  ["Italy",    12000]
                ]
              }),
              distinctValues = dataTable.getDistinctFormattedValues(0);

          expect(distinctValues).toEqual(["Portugal", null, "null", "Italy"]);
        });
      });

      describe("#addColumn()", function() {
        it("should add another column to the table", function() {
          var dataTable = new DataTable();
          dataTable.addColumn({id: "A", type: "string", label: "A"});
          expect(dataTable.getNumberOfColumns()).toBe(1);

          dataTable.addColumn({id: "B", type: "string", label: "B"});
          expect(dataTable.getNumberOfColumns()).toBe(2);
        });

        it("should add another column to the table as the last column", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "string"},
              {id: "B", type: "number"},
              {id: "C", type: "boolean"}
            ],
            rows: []
          });

          dataTable.addColumn({id: "D", type: "number", label: "D"});

          expect(dataTable.getColumnId(3)).toBe("D");
        });

        it("should return the index of the added column", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "string"},
              {id: "B", type: "number"},
              {id: "C", type: "boolean"}
            ],
            rows: []
          });

          var index = dataTable.addColumn({id: "D", type: "number", label: "D"});

          expect(index).toBe(3);
        });

        it("should respect all the specified known column attributes", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "string" },
              {id: "B", type: "number" },
              {id: "C", type: "boolean"}
            ],
            rows: []
          });

          var index = dataTable.addColumn({id: "D", type: "number", label: "d"});
          expect(dataTable.getColumnId(index)).toBe("D");
          expect(dataTable.getColumnType(index)).toBe("number");
          expect(dataTable.getColumnLabel(index)).toBe("d");
        });
      });
    });

    describe("cells -", function() {
      describe("#getValue()", function() {
        var dataTable = new DataTable({
          cols: [
            {id: "country", type: "string",  label: "Country"},
            {id: "sales",   type: "number",  label: "Sales"  },
            {id: "euro",    type: "boolean", label: "Euro"  }
          ],
          rows: [
            {c: ["Ireland",  1]}, // 0
            {c: ["Ireland",  2]}, // 1

            {c: ["Portugal", null]}, // 2
            {c: ["Portugal", undefined]}, // 3
            {c: ["Portugal", NaN ]}, // 4

            {c: ["Portugal", null, true ]}, // 5
            {c: ["Portugal", null, false]}, // 6

            {c: ["Ireland",  {v:  null, f: "NULL"}]}, // 7
            {c: ["Ireland",  {v:  undefined, f: "UNDEF"}]}, // 8
            {c: ["Ireland",  {v:  NaN, f: "NAN"}]}, // 9

            {c: ["France",   {v: {foo: 'bar'}, f:  "foo-bar"}]} // 10
          ]
        });

        it("should return the numeric value of the specified row and column", function() {
          expect(dataTable.getValue(0, 1)).toBe(1);
          expect(dataTable.getValue(1, 1)).toBe(2);
        });

        it("should return the string value of the specified row and column", function() {
          expect(dataTable.getValue(0, 0)).toBe("Ireland");
          expect(dataTable.getValue(2, 0)).toBe("Portugal");
        });

        it("should return the boolean value of the specified row and column", function() {
          expect(dataTable.getValue(5, 2)).toBe(true );
          expect(dataTable.getValue(6, 2)).toBe(false);
        });

        it("should return `null` if the value of the specified row and column is nully", function() {
          expect(dataTable.getValue(2, 1)).toBe(null);
          expect(dataTable.getValue(3, 1)).toBe(null);
        });

        it("should return `NaN` if the value of the specified row and column is `NaN`", function() {
          expect(dataTable.getValue(4, 1)).toBeNaN();
        });

        it("should return a `null` value in the 'v' property of the specified row and column is nully", function() {
          expect(dataTable.getValue(7, 1)).toBeNull();
          expect(dataTable.getValue(8, 1)).toBeNull();
        });

        it("should return a `NaN` value in the 'v' property of the specified row and column is `NaN`", function() {
          expect(dataTable.getValue(9, 1)).toBeNaN();
        });

        it("should return an object value in 'v' property of the specified row and columns pass-through ", function() {
          var v = dataTable.getValue(10, 1);
          expect(v instanceof Object).toBe(true);
          expect(v.foo).toBe("bar");
        });
      });

      describe("#getFormattedValue()", function() {
        var dataTable = new DataTable({
          cols: [
            {id: "country", type: "string",  label: "Country"},
            {id: "sales",   type: "number",  label: "Sales"  },
            {id: "euro",    type: "boolean", label: "Euro"   }
          ],
          rows: [
            {c: ["Ireland",  {v: 1, f: "1.0"}]},
            {c: ["Ireland",  {v: 2, f: null}]},
            {c: ["Ireland",  {v: 3, f: undefined}]},
            {c: ["Ireland",  {v: 4}]}, // 3

            {c: ["Ireland",  5]}, // 4

            {c: ["Portugal", null]},      // 5
            {c: ["Portugal", undefined]}, // 6
            {c: ["Portugal", NaN ]},      // 7

            {c: ["Portugal", null, true ]}, // 8
            {c: ["Portugal", null, false]}, // 9
            {c: [{v: "PT", f: "Portugal"}, null]}  // 10
          ]
        });

        it("should return the value of the 'f' cell property", function() {
          expect(dataTable.getFormattedValue(0, 1)).toBe("1.0");
        });

        it("should return the string value of the 'v' cell property if the 'f' property is nully or missing", function() {
          expect(dataTable.getFormattedValue(1, 1)).toBe("2");
          expect(dataTable.getFormattedValue(2, 1)).toBe("3");
          expect(dataTable.getFormattedValue(3, 1)).toBe("4");
        });

        it("should return the string value of a direct value (no cell object)", function() {
          expect(dataTable.getFormattedValue(4, 1)).toBe("5");
          expect(dataTable.getFormattedValue(4, 0)).toBe("Ireland");
          expect(dataTable.getFormattedValue(10, 0)).toBe("Portugal");
          expect(dataTable.getFormattedValue(7, 1)).toBe("NaN");
          expect(dataTable.getFormattedValue(8, 2)).toBe("true");
          expect(dataTable.getFormattedValue(9, 2)).toBe("false");
        });

        it("should return the `null` value if a direct value is nully", function() {
          expect(dataTable.getFormattedValue(5, 1)).toBe(null);
          expect(dataTable.getFormattedValue(6, 1)).toBe(null);
        });
      });

      describe("#getLabel()", function() {
        var dataTable = new DataTable({
          cols: [
            {id: "country", type: "string",  label: "Country"},
            {id: "sales",   type: "number",  label: "Sales"  },
            {id: "euro",    type: "boolean", label: "Euro"   }
          ],
          rows: [
            {c: ["Ireland",  {v: 1, f: "1.0"}]},
            {c: ["Ireland",  {v: 2, f: null}]},
            {c: ["Ireland",  {v: 3, f: undefined}]},
            {c: ["Ireland",  {v: 4}]}, // 3

            {c: ["Ireland",  5]}, // 4

            {c: ["Portugal", null]},      // 5
            {c: ["Portugal", undefined]}, // 6
            {c: ["Portugal", NaN ]},      // 7

            {c: ["Portugal", null, true ]}, // 8
            {c: ["Portugal", null, false]}, // 9
            {c: [{v: "PT", f: "Portugal"}, null]}  // 10
          ]
        });

        it("should return the value of the 'f' cell property", function() {
          expect(dataTable.getLabel(0,  1)).toBe("1.0");
          expect(dataTable.getLabel(10, 0)).toBe("Portugal");
        });

        it("should return `null` if the 'f' property is nully or missing", function() {
          expect(dataTable.getLabel(1, 1)).toBe(null);
          expect(dataTable.getLabel(2, 1)).toBe(null);
          expect(dataTable.getLabel(3, 1)).toBe(null);
        });

        it("should return `null` for a direct value (no cell object)", function() {
          expect(dataTable.getLabel(4, 1)).toBe(null);
          expect(dataTable.getLabel(4, 0)).toBe(null);
          expect(dataTable.getLabel(7, 1)).toBe(null);
          expect(dataTable.getLabel(8, 2)).toBe(null);
          expect(dataTable.getLabel(9, 2)).toBe(null);
        });

        it("should return the `null` value if a direct value is nully", function() {
          expect(dataTable.getLabel(5, 1)).toBe(null);
          expect(dataTable.getLabel(6, 1)).toBe(null);
        });
      });

      describe("#getCell()", function() {
        var dataTable = new DataTable({
          cols: [
            {id: "country", type: "string",  label: "Country"},
            {id: "sales",   type: "number",  label: "Sales"  },
            {id: "euro",    type: "boolean", label: "Euro"   }
          ],
          rows: [
            {c: ["Ireland",  {v: 1, f: "1.0"}]},

            {c: ["Ireland",  {v: null, f: null }]}, // 1
            {c: ["Ireland",  {v: null, f: undefined}]},
            {c: ["Ireland",  {v: undefined, f: null}]},
            {c: ["Ireland",  {v: undefined, f: undefined}]},

            {c: ["Ireland",  {v: null,      f: "1"}]}, // 5
            {c: ["Ireland",  {v: undefined, f: "1"}]},
            {c: ["Ireland",  {v: 1,         f: null}]},
            {c: ["Ireland",  {v: 1,         f: undefined}]},

            {c: ["Ireland",  5]}, // 9

            {c: ["Portugal", null]},        // 10
            {c: ["Portugal", undefined]},   // 11

            {c: ["Portugal", NaN]},         // 12
            {c: ["Portugal", null, true]},  // 13
            {c: ["Portugal", null, false]}, // 14
            {c: ["Portugal", 0]},           // 15

            {c: ["Ireland",  {v: 1, f: 1}]} // 16
          ]
        });

        it("should return a shallow copy of the internal cell object", function() {
          var cell0 = dataTable._jsonTable.rows[0].c[1];
          var cell1 = dataTable.getCell(0, 1);
          expect(cell0).not.toBe(cell1);
          expect(cell1.v).toBe(cell0.v);
          expect(cell1.f).toBe(cell0.f);
        });

        it("should return a cell 'f' property that is the string value of the source 'f' property", function() {
          expect(dataTable.getCell(16, 1).f).toBe("1");
        });

        it("should return `null` when both 'v' or 'f' have a nully value", function() {
          expect(dataTable.getCell(1, 1)).toBe(null);
          expect(dataTable.getCell(2, 1)).toBe(null);
          expect(dataTable.getCell(3, 1)).toBe(null);
          expect(dataTable.getCell(4, 1)).toBe(null);
        });

        it("should return a cell object when either 'v' or 'f' do not have a nully value", function() {
          expect(dataTable.getCell(5, 1) instanceof Object).toBe(true);
          expect(dataTable.getCell(6, 1) instanceof Object).toBe(true);
          expect(dataTable.getCell(7, 1) instanceof Object).toBe(true);
          expect(dataTable.getCell(8, 1) instanceof Object).toBe(true);
        });

        it("should create and return a cell object for direct values, with a `null` 'f' property", function() {
          function expectCell(i, j) {
            var cell = dataTable.getCell(i, j);
            expect(cell instanceof Object).toBe(true);
            expect(cell.f).toBe(null);
            return expect(cell.v);
          }


          expectCell(9,  1).toBe(5);
          expectCell(12, 1).toBeNaN();
          expectCell(13, 2).toBe(true);
          expectCell(14, 2).toBe(false);
          expectCell(15, 1).toBe(0);
        });

        it("should return `null` for direct nully values", function() {
          expect(dataTable.getCell(10, 1)).toBe(null);
          expect(dataTable.getCell(11, 1)).toBe(null);
        });
      });
    });

    describe("rows -", function() {
      describe("#getNumberOfRows() -", function() {
        it("should return 0 when there are no rows", function() {
          var dataTable = new DataTable();
          expect(dataTable.getNumberOfRows()).toBe(0);
        });

        it("should return 3 when there are 3 rows", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "A", type: "string"}
            ],
            rows: [
              {c: ["1"]},
              {c: ["2"]},
              {c: ["3"]}
            ]
          });
          expect(dataTable.getNumberOfRows()).toBe(3);
        });
      });

      describe("#getFilteredRows() -", function() {
        it("should return an empty array when there are 0 rows", function() {
          expect(new DataTable().getFilteredRows([])).toEqual([]);
        });

        it("should return all rows indexes of there are 0 filters", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "country", type: "string",  label: "Country"},
              {id: "sales",   type: "number",  label: "Sales"  }
            ],
            rows: [
              {c: ["Ireland",  1]},
              {c: ["Portugal", 2]},
              {c: ["Italy",    3]}
            ]
          });

          expect(dataTable.getFilteredRows([])).toEqual([0, 1, 2]);
        });

        it("should filter rows having a given value on the given column", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "country", type: "string",  label: "Country"},
              {id: "sales",   type: "number",  label: "Sales"  }
            ],
            rows: [
              {c: ["Ireland",  1]},
              {c: ["Portugal", {v: null, f: 2}]},
              {c: ["Ireland",  {v: 2}]},
              {c: ["Portugal", 2]},
              {c: [2,          NaN]}
            ]
          });

          expect(dataTable.getFilteredRows([{column: 0, value: "Portugal"}])).toEqual([1, 3]);

          expect(dataTable.getFilteredRows([{column: 1, value: 2}])).toEqual([2, 3]);
        });

        it("should filter rows having a value on a column _and_ another value on another column", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "country", type: "string",  label: "Country"},
              {id: "sales",   type: "number",  label: "Sales"  }
            ],
            rows: [
              {c: ["Portugal",  1]},
              {c: ["Portugal", {v: null, f: 2}]},
              {c: ["Ireland",  {v: 2}]},
              {c: ["Portugal", 2]},
              {c: [2,          NaN]}
            ]
          });

          expect(dataTable.getFilteredRows([
            {column: 0, value: "Portugal"},
            {column: 1, value: 2}
          ])).toEqual([3]);
        });

        it("should filter rows having a `null` (or `undefined`) value on a column", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "country", type: "string",  label: "Country"},
              {id: "sales",   type: "number",  label: "Sales"  }
            ],
            rows: [
              {c: ["Portugal", null]},
              {c: ["Portugal", {v: null}]},
              {c: ["Ireland",  {v: 2}]},
              {c: ["Portugal", undefined]},
              {c: [2,          {v: undefined}]}
            ]
          });

          expect(dataTable.getFilteredRows([
            {column: 1, value: null}
          ])).toEqual([0, 1, 3, 4]);
        });

        it("should filter rows having an `NaN` value on a column", function() {
          var dataTable = new DataTable({
            cols: [
              {id: "country", type: "string",  label: "Country"},
              {id: "sales",   type: "number",  label: "Sales"  }
            ],
            rows: [
              {c: ["Portugal", 1]},
              {c: ["Portugal", 2]},
              {c: ["Ireland",  {v: 2}]},
              {c: ["Portugal", null]},
              {c: [2,          NaN]}
            ]
          });

          expect(dataTable.getFilteredRows([
            {column: 1, value: NaN}
          ])).toEqual([4]);
        });

      });
    });
  });
});
