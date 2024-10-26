import {getJsDelivrBundles, selectBundle, ConsoleLogger, AsyncDuckDB, AsyncDuckDBConnection} from '@duckdb/duckdb-wasm';
import { Dictionary, Closable } from './types';

const TABLES = {
  elements : "http://localhost:5173/tables/elements.all.parquet",
  spectral_lines : "http://localhost:5173/tables/elements.spectral_lines.parquet"
}

 

async function InitDuckDB() {
  const JSDELIVR_BUNDLES = getJsDelivrBundles();

  const bundle = await selectBundle(JSDELIVR_BUNDLES);

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], {type: 'text/javascript'})
  );

  // Instantiate the asynchronus version of DuckDB-wasm
  const worker = new Worker(worker_url);
  const logger = new ConsoleLogger();
  const db = new AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  return db;
}

const DB = await InitDuckDB();

// const conn = await DB.connect();

function toDictionaryArray(res : any): Dictionary[] {
  console.log("toDictionaryArray : ", res);
  
  return res.toArray()
  .map((row : any)=>row.toJSON());
}

async function fetch(table: keyof typeof TABLES) {
  // if(!conn) console.error(`duck db connection null or undefined. Can't fetch table : ${table}`);

  const tableUrl = TABLES[table];
  
  if(!tableUrl) console.error(`Can't fetch table : ${table}, tableUrl : ${tableUrl} not found in TABLES dictionary`);
  runQuery( conn => {
    conn.query(`
      CREATE TABLE ${table} AS
          SELECT * FROM "${tableUrl}"
    `);
  })
  return new ResultTable(table, tableUrl,);
}

// async function runClosable(closable : Closable, f : () => any) {

// }

async function runQuery(f :(conn : AsyncDuckDBConnection) => any) : Promise<any> {
  const conn = await DB.connect();
  const res = await f(conn);
  await conn.close();
  return res;
}

async function query(querystr : string, ...params : any[]) : Promise<Dictionary[]> {
  return await runQuery(async conn => {
    // run statement
    let stmt = await conn.prepare(querystr)
    const result = toDictionaryArray(await stmt.query(...params))
    await stmt.close();

    return result;
  });
}

export default { 
  fetch,
  query
}




export class ResultTable {
  table : string
  url   : string
  conn ?: AsyncDuckDBConnection
  
  constructor(table : string, url : string, conn ?: AsyncDuckDBConnection) {
    this.table = table;
    this.url = url;

    this.conn = conn;

    // create danfojs DataFrame
  }

  

  async all() : Promise<Dictionary[]> {
    return await query(`SELECT * FROM ${this.table}`);
  }

  async where(params : Dictionary) : Promise<Dictionary> {
    const baseQuery       : string = `SELECT * FROM ${this.table}`;
    const paramsValueList : any[]  = [];
    let finalQuery        : string = "";
    let whereClause       : string = "";

    if (params) {
      Object.entries(params).forEach(([paramName, paramValue], index) => {
        if (index === 0) {
          whereClause += ` WHERE ${paramName} = ?`
        } else {
          whereClause += ` AND ${paramName} = ?`
        }

        paramsValueList.push(paramValue)
      })

      finalQuery = baseQuery + whereClause;
    }
    console.log("finalQuery: ", finalQuery, paramsValueList);
    
    return await query(finalQuery, ...paramsValueList);
  }
}



