/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50533
 Source Host           : localhost
 Source Database       : bugreport

 Target Server Type    : MySQL
 Target Server Version : 50533
 File Encoding         : utf-8

 Date: 07/05/2014 21:59:09 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `bugs`
-- ----------------------------
DROP TABLE IF EXISTS `bugs`;
CREATE TABLE `bugs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `UDID` varchar(255) NOT NULL,
  `priority` int(11) NOT NULL,
  `type` varchar(100) NOT NULL DEFAULT 'Inconnu',
  `platform` varchar(100) NOT NULL,
  `platform_version` varchar(100) NOT NULL,
  `app_version` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `timestamp` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `keys`
-- ----------------------------
DROP TABLE IF EXISTS `keys`;
CREATE TABLE `keys` (
  `api_key` varchar(255) NOT NULL,
  `master` tinyint(1) NOT NULL,
  PRIMARY KEY (`api_key`),
  KEY `master` (`master`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `trackers`
-- ----------------------------
DROP TABLE IF EXISTS `trackers`;
CREATE TABLE `trackers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `UDID` varchar(255) NOT NULL,
  `feature` varchar(100) NOT NULL,
  `action` varchar(255) NOT NULL,
  `app_version` varchar(100) NOT NULL,
  `platform` varchar(100) NOT NULL,
  `platform_version` varchar(100) NOT NULL,
  `note` text,
  `timestamp` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
