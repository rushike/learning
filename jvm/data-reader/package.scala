package com.db.treasury.cassini.analyzer

import tech.tablesaw.api.Table

import java.nio.file.{Path, Paths}
import scala.collection.mutable



package object core {
  case class Chain[T](dt : T) {
    def transfrom(function1: Function1[T, T]) = Chain(function1(dt))
    def end() : T = dt
  }

  case class ReadOpts(opts: Map[String, Any]) {

    val path: Path = Paths.get(opts("path").toString)
    val header : Long = opts.getOrElse("header", "-1").toString.toLong
    def get[T](key : String): T = opts(key).asInstanceOf[T]

    def keys(): List[String] = List("path", "header")
  }

  abstract class RowRecord(row : Any) {
    def get(key : String) : String
    def get(index : Int) : String

    def toMap: java.util.HashMap[String, String]
  }
}
