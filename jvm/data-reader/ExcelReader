package com.db.treasury.cassini.analyzer.core

import org.apache.poi.ooxml.util.SAXHelper
import org.apache.poi.openxml4j.opc.{OPCPackage, PackageAccess}
import org.apache.poi.ss.SpreadsheetVersion
import org.apache.poi.ss.usermodel.{Cell, CellType, DataFormatter, Workbook}
import org.apache.poi.ss.util.{AreaReference, CellRangeAddress, CellReference}
import org.apache.poi.util.XMLHelper
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler.SheetContentsHandler
import org.apache.poi.xssf.eventusermodel.{ReadOnlySharedStringsTable, XSSFReader, XSSFSheetXMLHandler}
import org.apache.poi.xssf.model.{CommentsTable, StylesTable}
import org.apache.poi.xssf.streaming.{SXSSFRow, SXSSFWorkbook}
import org.apache.poi.xssf.usermodel.{XSSFComment, XSSFRow, XSSFSheet, XSSFWorkbook}
import org.xml.sax.{ContentHandler, InputSource}

import java.io.{BufferedInputStream, File, FileInputStream, InputStream}
import java.nio.file.Path
import java.util
import javax.xml.parsers.DocumentBuilderFactory
import scala.collection.JavaConverters.asJavaIterableConverter
import scala.collection.convert.ImplicitConversions.{`collection asJava`, `iterable AsScalaIterable`}
import scala.util.Try
import scala.util.control.Breaks.{break, breakable}
//import javax.print.DocFlavor.STRING

class ExcelReadOpts(override val opts : Map[String, Any]) extends ReadOpts(opts) {
  val sheetName: String = opts.getOrElse("sheetName", "Sheet1").toString

  val sheets : List[String] = opts.get("sheets") match {
    case Some(allSheets) => allSheets.asInstanceOf[List[String]]
    case None => List(sheetName)
  }

  val dataAddress: CellRangeAddress = {
    if (opts("dataAddress").isInstanceOf[Map[String, String]]) {

      val arr = opts("dataAddress")
        .asInstanceOf[Map[String, String]]
        .toArray
        .map(_._2)

      val first = ExcelReadOpts.rangeAddr(arr(0))
      val last = ExcelReadOpts.rangeAddr(arr(arr.length - 1))
      new CellRangeAddress(first.getFirstRow,last.getLastRow, first.getFirstColumn, last.getLastColumn )
    } else ExcelReadOpts.rangeAddr(opts.getOrElse("dataAddress", "A1").asInstanceOf[String])
  }

  val dataAddressRangeMap: Map[String, CellRangeAddress] = {
    if (opts("dataAddress").isInstanceOf[Map[String, String]]) {
      opts("dataAddress")
        .asInstanceOf[Map[String, String]]
        .foldLeft(Map[String, CellRangeAddress]())({
          case (map , (key, dataAddress)) => map ++ Map(key -> ExcelReadOpts.rangeAddr(dataAddress))
        })
    } else Map("0" -> ExcelReadOpts.rangeAddr(opts.getOrElse("dataAddress", "A1").asInstanceOf[String]))
  }
  val startRow : Int = opts.getOrElse("startRow", "1").toString.toInt

  val key : String = opts.getOrElse("key", "key").toString
}

object ExcelReadOpts {
  def apply(elems: (String, Any) *): ExcelReadOpts = new ExcelReadOpts(elems.toMap)

  def rangeAddr(dataAddress : String) = {
    val wholeColRegex = "^[a-zA-Z]+:[a-zA-Z]+$".r
    val res = if (wholeColRegex.findAllIn(dataAddress).nonEmpty) {
      dataAddress.split(":") match {
        case Array(startCol, endCol) => {
          val startCell = new CellReference(s"${startCol}0");
          val endCell = new CellReference(s"${endCol}${SpreadsheetVersion.EXCEL2007.getLastRowIndex}")
          new CellRangeAddress(startCell.getRow(), endCell.getRow(), startCell.getCol(), endCell.getCol());
        }
      }
    } else CellRangeAddress.valueOf(dataAddress)
    res
  }
}


case class ExcelRowRecord( row : XSSFRow, header : util.ArrayList[String], dataAddressRange : CellRangeAddress, recordType : String = "DEFAULT") extends RowRecord {
  val sheetName: String = row.getSheet.getSheetName
  def get(key: String): String = {
    val index = header.indexOf(key) + dataAddressRange.getFirstColumn
    val cell = row.getCell(index)
    cell.getCellType match {
      case CellType.STRING => cell.getStringCellValue
      case CellType.NUMERIC => cell.getNumericCellValue.toString
      case _ => ""
    }
  }

  def get(index : Int) : String = {
    val cell = row.getCell(index)

    if(cell == null) return  ""

    cell.getCellType match {
      case CellType.STRING => cell.getStringCellValue
      case CellType.NUMERIC => cell.getNumericCellValue.toString
      case _ => ""
    }
  }

  def toMap(): util.HashMap[String, String] = {
    val map = new util.HashMap[String, String](header.size())
    map.put("type", recordType)
    map.put("sheet", sheetName)
    for (i <- 0 until header.size()) {
      map.put(header.get(i), get(i))
    }
    map
  }
}

case class ExcelStreamRowRecord1(row : util.ArrayList[String], header : util.ArrayList[String], dataAddressRange : CellRangeAddress, recordType : String = "DEFAULT") extends RowRecord {
  val sheetName: String = "TOADD!!!"
  def get(key: String): String = {
    val index = header.indexOf(key) + dataAddressRange.getFirstColumn
    row.get(index)
  }

  def get(index : Int) : String = {
    row.get(index)
  }

  def toMap(): util.HashMap[String, String] = {
//    println("all : ", header, row, dataAddressRange, recordType)
    val map = new util.HashMap[String, String](header.size())
    map.put("type", recordType)
    map.put("sheet", sheetName)
    for (i <- dataAddressRange.getFirstColumn until dataAddressRange.getLastColumn) {
//      println("i, header", header.size(), header.get(i), row.size())
      map.put(header.get(i), get(i))
    }
    map
  }
}


case class ExcelStreamRowRecord(row : util.HashMap[Int, String], header : util.HashMap[Int, String], dataAddressRange : CellRangeAddress, recordType : String = "DEFAULT") extends RowRecord {
  val sheetName: String = "TOADD!!!"
  val headerColMap = {
    val resMap = new util.HashMap[String, Int](header.size())
    header.forEach({
      case (key, value) => resMap.put(value, key)
    })
    resMap
  }
  def get(key: String): String = {
    val index = headerColMap.get(key)
    row.get(index)
  }

  def get(index : Int) : String = {
    row.get(index)
  }

  def toMap(): util.HashMap[String, String] = {
    //    println("all : ", header, row, dataAddressRange, recordType)
    val map = new util.HashMap[String, String](header.size())
    map.put("type", recordType)
    map.put("sheet", sheetName)
    for (i <- dataAddressRange.getFirstColumn until dataAddressRange.getLastColumn) {
      //      println("i, header", header.size(), header.get(i), row.size())
      map.put(header.get(i), get(i))
    }
    map
  }
}


class ExcelReadStream1(readOpts: ExcelReadOpts, callbackFn : ExcelStreamRowRecord1 => Unit) extends SheetContentsHandler{
//  val headerMap = new util.HashMap[String, util.ArrayList[String]]()
//  val valuesMap = new util.HashMap[String, util.ArrayList[String]]()
  private val maxCols = readOpts.opts.getOrElse("maxCols", SpreadsheetVersion.EXCEL2007.getLastColumnIndex).toString.toInt
  private val header = new util.ArrayList[String](maxCols)
  private val values = new util.ArrayList[String](maxCols)

  private var rowId : Int = -1
  private var prevColId = 0
  private var currColId = 0
  override def startRow(rowNum: Int): Unit = {
    rowId = rowNum
    values.clear()
    for(i <- 0 until maxCols) {
      if (rowId > readOpts.header) values.add(i, "") // adding blank values
      else if (rowId == readOpts.header) header.add(i, "")
    }

    println("row started", rowNum, rowId, header.size(), values.size())

  }

  override def endRow(rowNum: Int): Unit = {
    readOpts.dataAddressRangeMap.forEach({
      case (recordType, rangeAddress: CellRangeAddress) if rowId > readOpts.header => callbackFn(
        ExcelStreamRowRecord1(values, header, rangeAddress, recordType)
      )
      case _ =>
    })
  }

  override def cell(cellReference: String, formattedValue: String, comment: XSSFComment): Unit = {
    if (rowId < readOpts.header) return
    val cellRef = new CellReference(cellReference)
    currColId = cellRef.getCol


    if(rowId == readOpts.header)
      header.set(currColId, formattedValue)
    else
      values.set(currColId, formattedValue)


    prevColId = currColId
//    println("cell call : ", cellReference, formattedValue, comment, prevColId, currColId)
  }
}

class ExcelReadStream(readOpts: ExcelReadOpts, callbackFn : ExcelStreamRowRecord => Unit) extends SheetContentsHandler{
  //  val headerMap = new util.HashMap[String, util.ArrayList[String]]()
  //  val valuesMap = new util.HashMap[String, util.ArrayList[String]]()
  private val maxCols = readOpts.opts.getOrElse("maxCols", SpreadsheetVersion.EXCEL2007.getLastColumnIndex).toString.toInt
  private val header = new util.HashMap[Int, String]()
  private val values = new util.HashMap[Int, String]()

  private var rowId : Int = -1
  private var prevColId = 0
  private var currColId = 0
  override def startRow(rowNum: Int): Unit = {
    rowId = rowNum
    values.clear()
  }

  override def endRow(rowNum: Int): Unit = {
    readOpts.dataAddressRangeMap.forEach({
      case (recordType, rangeAddress: CellRangeAddress) if rowId > readOpts.header => callbackFn(
        ExcelStreamRowRecord(values, header, rangeAddress, recordType)
      )
      case _ =>
    })
//    println("row ended", rowNum, rowId, header.size(), values.size())
  }

  override def cell(cellReference: String, formattedValue: String, comment: XSSFComment): Unit = {
    if (rowId < readOpts.header) return
    val cellRef = new CellReference(cellReference)
    currColId = cellRef.getCol


    if(rowId == readOpts.header)
      header.put(currColId, formattedValue)
    else if(rowId > readOpts.header)
      values.put(currColId, formattedValue)


    prevColId = currColId
    //    println("cell call : ", cellReference, formattedValue, comment, prevColId, currColId)
  }
}

class WorkbookDetails(sheetsRelIdMap : Map[String, String]) {
  def getRelId(sheetName : String) : String = {
    sheetsRelIdMap.getOrElse(sheetName, "")
  }

  def getSheetNameRelIdList(sheetNames : List[String]) : List[(String, String)] = {
    sheetsRelIdMap.map({
      case (sheetName, relId) if sheetNames.contains(sheetName) => Some(sheetName, relId)
      case _ => None
    }).filter(_.nonEmpty)
      .map(_.get)
      .toList
  }
}

object WorkbookDetails {
  def apply(stream : InputStream): WorkbookDetails = {
    if (stream == null) return new WorkbookDetails(Map.empty[String, String])

    val factory = DocumentBuilderFactory.newInstance();
    val builder = factory.newDocumentBuilder();
    val doc = builder.parse(stream)
    val sheetsNodes = doc.getElementsByTagName("sheet")
    var map = Map.empty[String, String]
    for(i <- 0 until sheetsNodes.getLength) {
      val sheetAttrs = sheetsNodes.item(i).getAttributes()
      val sheetName = sheetAttrs.getNamedItem("name").getNodeValue();
      val relId = sheetAttrs.getNamedItem("r:id").getNodeValue()
      map ++= Map(sheetName -> relId)
    }
    new WorkbookDetails(map)
  }
}
case class ExcelReader(readOpts: ExcelReadOpts) extends Iterable[java.util.HashMap[String, String]] {

  override def iterator: Iterator[util.HashMap[String, String]] = new Iterator[util.HashMap[String, String]] {
    override def hasNext: Boolean = ???

    override def next(): util.HashMap[String, String] = ???
  }

  lazy val workbook = new XSSFWorkbook(readOpts.path.toFile)
  def getXSSFWorkbookSheet: XSSFSheet = {
//    val file = new FileInputStream(readOpts.path.toFile)
//    val bfile = new BufferedInputStream(file)
    val start = System.currentTimeMillis()
    val workbook = new XSSFWorkbook(readOpts.path.toFile)
    println("Reading Init ajj wirj : ", System.currentTimeMillis() - start)
    workbook.getSheet(readOpts.sheetName)
  }


  def forEach(callbackFn : (util.HashMap[String, String]) => Unit) = {
    val sheet = getXSSFWorkbookSheet
    val dataRange = readOpts.dataAddress
    val header = new util.ArrayList[String]()
    val start = System.currentTimeMillis()
    val startIndex = if(readOpts.header != -1) {
      sheet.getRow(readOpts.startRow).forEach(cell => {
        cell.getCellType match {
          case CellType.STRING => header.add(cell.toString)
          case CellType.NUMERIC => header.add(cell.toString)
          case _ =>
        }
      })
      readOpts.startRow + 1
    } else {
      for(i <- dataRange.getFirstColumn until dataRange.getLastColumn) {
        header.add(i.toString)
      }
      readOpts.startRow
    }


    breakable {
      for (i <- startIndex until sheet.getLastRowNum) {
        val row = sheet.getRow(i)

        if(row == null) break
        val rec = new util.HashMap[String, String]()
//        println("row : ", row)
//        println("row first and last : ", i, row.getFirstCellNum, row.getLastCellNum)
        for (j <- row.getFirstCellNum until row.getLastCellNum ) {
          val headerColumn = header.get(j)
          val cell = row.getCell(j)
          cell.getCellType match {
            case CellType.STRING => rec.put(headerColumn, cell.toString)
            case CellType.NUMERIC => rec.put(headerColumn, cell.toString)
            case _ =>
          }
        }
        callbackFn(rec)
      }

    }
    println("inner time : ", System.currentTimeMillis() - start)
  }

  def getAll() = {
    val resMap = new util.HashMap[String, util.HashMap[String, String]]()
    val sheet = workbook.getSheet(readOpts.sheetName)
    val dataRange = readOpts.dataAddress
    val header = new util.ArrayList[String]()
    val start = System.currentTimeMillis()
    val startIndex = if(readOpts.header != -1) {
      sheet.getRow(readOpts.startRow).forEach(cell => {
        cell.getCellType match {
          case CellType.STRING => header.add(cell.getStringCellValue)
          case CellType.NUMERIC => header.add(cell.getNumericCellValue.toString)
          case _ =>
        }
      })
      readOpts.startRow + 1
    } else {
      for(i <- dataRange.getFirstColumn until dataRange.getLastColumn) {
        header.add(i.toString)
      }
      readOpts.startRow
    }


    breakable {
      for (i <- startIndex until sheet.getLastRowNum) {
        val row = sheet.getRow(i)

        if(row == null) break

        val record = ExcelRowRecord(row, header, dataRange)
        resMap.put(record.get(readOpts.key), record.toMap())
      }
    }
    println("get all time : ", System.currentTimeMillis() - start)

    resMap
  }

  def forEach5(callbackFn : RowRecord => Unit) = {
    val start = System.currentTimeMillis()
    val pkg = OPCPackage.open(readOpts.path.toAbsolutePath.toString, PackageAccess.READ);
//    println("took opcPackage ini init : ", System.currentTimeMillis() - start)
    val xssfReader = new XSSFReader(pkg);
//    println("took xssf reader init : ", System.currentTimeMillis() - start)
    val styles = xssfReader.getStylesTable();
//    val comments = new CommentsTable();
    val sst = new ReadOnlySharedStringsTable(pkg);
    val formatter = new DataFormatter();
    val workStart = System.currentTimeMillis()
    val workbookDetails = WorkbookDetails(xssfReader.getWorkbookData())
//    println("parse the workbook details in ", System.currentTimeMillis() - workStart)
    workbookDetails.getSheetNameRelIdList(readOpts.sheets).foreach((sheetName : String, relId : String) => {
      val innerStart = System.currentTimeMillis()
      val sheetStream = xssfReader.getSheet(relId)
      val sheetSource = new InputSource(sheetStream);
      val sheetHandler = new ExcelReadStream(readOpts, callbackFn)
      val sheetParser = XMLHelper.newXMLReader();
      val handler = new XSSFSheetXMLHandler(styles, null, sst, sheetHandler, formatter, false);

      sheetParser.setContentHandler(handler);
      sheetParser.parse(sheetSource);
      sheetStream.close();
//      println("inner loop is : ", relId, System.currentTimeMillis() - innerStart)
    })

    println("took forach 5 : ", System.currentTimeMillis() - start)
  }
    def forEach4(callbackFn : (RowRecord) => Unit) = {
    val start = System.currentTimeMillis()
    readOpts.sheets.foreach(sheetName => {
      val sheet = workbook.getSheet(sheetName)

      val dataAddressMap = readOpts.dataAddressRangeMap

      val headerMap = new util.HashMap[String, util.ArrayList[String]]()// new util.ArrayList[String]()

      val startIndex = if(readOpts.header != -1) {
        sheet.getRow(readOpts.startRow).forEach(cell => {
          dataAddressMap.asJava.forEach({
            case (key, rangeAddress: CellRangeAddress) if rangeAddress.isInRange(cell.getAddress) => {
              val header = headerMap.getOrDefault(key, new util.ArrayList[String]())
              headerMap.put(key, header)
              cell.getCellType match {
                case CellType.STRING => header.add(cell.getStringCellValue)
                case CellType.NUMERIC => header.add(cell.getNumericCellValue.toString)
                case _ =>
              }
            }

            case _ =>
          })

        })
        readOpts.startRow + 1
      } else {
        dataAddressMap.asJava.forEach({
          case (key, rangeAddress: CellRangeAddress) => {
            val header = new util.ArrayList[String]()
            headerMap.put(key, header)
            for(i <- rangeAddress.getFirstColumn until rangeAddress.getLastColumn) {
              header.add(i.toString)
            }
          }
        })
        readOpts.startRow
      }

      breakable {
        for (i <- startIndex until sheet.getLastRowNum) {
          val row = sheet.getRow(i)

          if(row == null) break

          dataAddressMap.asJava.forEach({
            case (key, range) => {
              if(row.getFirstCellNum > range.getFirstColumn || row.getLastCellNum <= range.getLastColumn) {
                break()
              }
              callbackFn(ExcelRowRecord(row, headerMap.get(key), range, key))
            }
          })

        }
      }
    })
    println("inner 4 time : ", System.currentTimeMillis() - start)
  }

  def forEach3(callbackFn : (RowRecord) => Unit) = {
    val sheet = workbook.getSheet(readOpts.sheetName)
    val dataRange = readOpts.dataAddress
    val header = new util.ArrayList[String]()
    val start = System.currentTimeMillis()
    val startIndex = if(readOpts.header != -1) {
      sheet.getRow(readOpts.startRow).forEach(cell => {
        if (dataRange.isInRange(cell)) {
          cell.getCellType match {
            case CellType.STRING => header.add(cell.getStringCellValue)
            case CellType.NUMERIC => header.add(cell.getNumericCellValue.toString)
            case _ =>
          }
        }
      })
      readOpts.startRow + 1
    } else {
      for(i <- dataRange.getFirstColumn until dataRange.getLastColumn) {
        header.add(i.toString)
      }
      readOpts.startRow
    }


    breakable {
      for (i <- startIndex until sheet.getLastRowNum) {
        val row = sheet.getRow(i)

        if(row == null) break

        callbackFn(ExcelRowRecord(row, header, dataRange))
      }
    }
    println("inner 3 time : ", System.currentTimeMillis() - start)
  }

  def forEach2(callbackFn : (util.HashMap[String, String]) => Unit) = {
    val sheet = getXSSFWorkbookSheet
    val dataRange = readOpts.dataAddress
    val rowIterator = sheet.rowIterator()
    val (header, offset) : (Array[String], Int) = if (rowIterator.hasNext) {
      val row = rowIterator.next()
      (row.foldLeft(Array[String]())({
        case (array, cell) => array ++ Array(cell.getStringCellValue)
      }), 1)
    } else {
      ((dataRange.getFirstColumn to dataRange.getLastColumn).toArray.map(_.toString), 0)
    }
    val start = System.currentTimeMillis()

    {
      var i = 0 + offset
      rowIterator.forEachRemaining(row => {
        val rec = new util.HashMap[String, String]()
        var j = 0
        row.forEach(cell => {
          if (dataRange.isInRange(cell.getAddress)) {
            val headerColumn = header(j)
            cell.getCellType match {
              case CellType.STRING => rec.put(headerColumn, cell.getStringCellValue)
              case CellType.NUMERIC => rec.put(headerColumn, cell.getNumericCellValue.toString)
              case _ =>
            }
//            val value = Try(cell.getStringCellValue ).getOrElse(cell.getNumericCellValue.toString)
          }
          j += 1
        })
        callbackFn(rec)
        i += 1
      })
    }

    println("looping ended in :" , System.currentTimeMillis() - start)

  }
}

object ExcelReader {
  def getCellRangeAddr(dataAddress : String): CellRangeAddress = {
    val wholeColRegex = "^[a-zA-Z]+:[a-zA-Z]+$".r
    if (wholeColRegex.findAllIn(dataAddress).nonEmpty) {
      dataAddress.split(":") match {
        case Array(startCol, endCol) => {
          val startCell = new CellReference(s"${startCol}0");
          val endCell = new CellReference(s"${endCol}${SpreadsheetVersion.EXCEL2007.getLastRowIndex}")
          new CellRangeAddress(startCell.getRow(), endCell.getRow(), startCell.getCol(), endCell.getCol());
        }
      }
    } else CellRangeAddress.valueOf(dataAddress)
  }

  def read_excel(readOpts : ExcelReadOpts): ExcelReader = {
    ExcelReader(readOpts)
  }
}


object TextExcelParser extends  App {
  val path = "C:\\Users\\bangrus\\dev\\data\\ubr\\1724749213498.xlsx"

  val parser = ExcelReader.read_excel(ExcelReadOpts(
    "path" -> path,
    "sheetName" -> "Sheet",
    "dataAddress" -> "A:AR",
    "startRow" -> "0",
    "key" -> "code"
  ))
  val start = System.currentTimeMillis()
  val resMap = new util.HashMap[String, util.HashMap[String, String]]()

  parser.forEach5(row => {
//    println(row)
    val rec = row.toMap
    resMap.put(rec.get("code"),rec)
//    resMap.put(row.get("code"),row)
  })

//  val res = parser.getAll()

  println("size : ", resMap.size())
  println("time taook ", System.currentTimeMillis() - start)


};
