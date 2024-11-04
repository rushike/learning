package com.db.treasury.cassini.analyzer.core

import com.db.treasury.cassini.analyzer.ubr.UBR.config
import org.apache.commons.csv.{CSVFormat, CSVParser, CSVRecord}
import tech.tablesaw.api.Table
import tech.tablesaw.io.csv.CsvReadOptions

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Paths}


class CSVReadOpts(override val opts : Map[String, String]) extends ReadOpts(opts)

object CSVReadOpts {
  def apply(elems: (String, String) *): CSVReadOpts = new CSVReadOpts(elems.toMap)
}

object CSVReader {
  Map(1 -> 3)
  def read_csv(readOpts : CSVReadOpts) = {
    // create a reader
    val reader = Files.newBufferedReader(readOpts.path, StandardCharsets.ISO_8859_1);
    // read csv file parser
   CSVFormat.DEFAULT.withFirstRecordAsHeader()
      .withIgnoreHeaderCase()
      .withTrim()
      .parse(reader)

  }
}
