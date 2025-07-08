SRC_DIR := src
DIST_DIR := dist
PACKAGE_NAME := startpage
BROWSERS := firefox chrome edge

all: build-firefox build-chrome build-edge

clean:
	rm -rf $(DIST_DIR)

prepare-dist:
	mkdir -p $(DIST_DIR)/$(@:prepare-dist-%=%)
	cp -r $(SRC_DIR)/* $(DIST_DIR)/$(@:prepare-dist-%=%)/

prepare-dist-firefox:
	mkdir -p $(DIST_DIR)/firefox
	cp -r $(SRC_DIR)/* $(DIST_DIR)/firefox/

prepare-dist-chrome:
	mkdir -p $(DIST_DIR)/chrome
	cp -r $(SRC_DIR)/* $(DIST_DIR)/chrome/

prepare-dist-edge:
	mkdir -p $(DIST_DIR)/edge
	cp -r $(SRC_DIR)/* $(DIST_DIR)/edge/

build-firefox: clean prepare-dist-firefox
	cp $(SRC_DIR)/manifest.json $(DIST_DIR)/firefox/manifest.json
	web-ext build --source-dir=$(DIST_DIR)/firefox --artifacts-dir=$(DIST_DIR)/firefox
	mv $(DIST_DIR)/firefox/$(PACKAGE_NAME)-*.zip $(DIST_DIR)

build-chrome: clean prepare-dist-chrome
	cp $(SRC_DIR)/manifest.json $(DIST_DIR)/chrome/manifest.json
	cd $(DIST_DIR)/chrome && zip -r ../$(PACKAGE_NAME)-chrome.zip *

build-edge: clean prepare-dist-edge
	cp $(SRC_DIR)/manifest.json $(DIST_DIR)/edge/manifest.json
	cd $(DIST_DIR)/edge && zip -r ../$(PACKAGE_NAME)-edge.zip *

.PHONY: all clean prepare-dist build-chrome build-firefox build-edge
