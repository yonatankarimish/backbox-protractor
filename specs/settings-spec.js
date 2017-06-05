/**
 * Created by Yonatan on 28/05/2017.
 */
describe('Backbox base tasks', function() {
    it('should show the title', function() {
        expect(browser.getTitle()).toEqual('BackBox');
    });

    it('should take settings screenshots', function(){
        var settingElement = element(by.linkText('Settings'));
        settingElement.click().then(function(){
            var sections = ['Interfaces', 'Routing', 'DNS', 'Date And Time', 'Alerts', 'Administration', 'Licenses', 'Access Rules', 'Sites', 'Agents', 'System Logs'];
            junction(0);

            function junction(idx){
                var linkText = sections[idx];
                element(by.linkText(linkText)).click().then(function() {
                    return element.all(by.css('div[data-bb-tabs]'));
                }).then(function(tabs) {
                    if(tabs && tabs.length) {
                        shootTabsPage();
                    }else {
                        element.all(by.css('div[ui-grid]')).then(function(grid){
                            if(grid && grid.length){
                                shootSimplePage().then(function(){shootGridPage()});
                            }else{
                                shootSimplePage();
                            }
                        });
                    }
                }).then(function(){
                    if(++idx < sections.length){
                        junction(idx);
                    }
                });
            }
        });

        function shootTabsPage() {
            element.all(by.css('ul.ui-tabs-nav li')).then(function(tabs){
                if(tabs && tabs.length) {
                    handleTab(0);
                }

                function handleTab(idx){
                    var tab = tabs[idx];
                    tab.getCssValue('display').then(function (displayProp) {
                        if(displayProp.indexOf('none') == -1){
                            tab.click().then(function () {
                                return tab.getText();
                            }).then(function (tabName) {
                                shootSimplePage(tabName);
                                if (++idx < tabs.length) {
                                    handleTab(idx);
                                }
                            });
                        }else if(++idx < tabs.length) {
                            handleTab(idx);
                        }
                    });
                }
            });
        }

        function shootGridPage(){
            var icons = element.all(by.css('.action-btn-wrap ul li')).then(function(actionList) {
                if(actionList && actionList.length) {
                    handleDialog(0);
                }

                function handleDialog(idx){
                    var button = actionList[idx].element(by.tagName('span'));
                    var checkbox = element.all(by.css('.ui-grid-selection-row-header-buttons')).get(1);
                    checkbox.getAttribute('class').then(function(cssClass){
                        if(cssClass.indexOf('ui-grid-row-selected') > -1) {
                            return checkbox;
                        }else{
                            return checkbox.click();
                        }
                    }).then(function() {
                        return actionList[idx].getAttribute('disabled');
                    }).then(function(disabled) {
                        if(!disabled) {
                            button.click().then(function () {
                                browser.sleep(2000);
                                return browser.params.helpers.getCurrentState();
                            }).then(function (state) {
                                return button.getAttribute('title').then(function (action) {
                                    return state.split('.').join('_') + "_" + action;
                                });
                            }).then(function (fileName) {
                                browser.params.helpers.takeScreenshot(fileName + '.png');
                                return element(by.css('.modal-dialog .ui-dialog .ui-dialog-titlebar-close')).click();
                            }).then(function () {
                                browser.sleep(2000);
                                if(++idx < actionList.length) {
                                    handleDialog(idx);
                                }
                            });
                        }
                    });
                }
            });
        }

        function shootSimplePage(name) {
            var subName = name ? '_' + name.split(' ').join('_') : '';
            return browser.params.helpers.getCurrentState().then(function (state) {
                return state.split('.').join('_') + subName;
            }).then(function (fileName) {
                browser.params.helpers.takeScreenshot(fileName + '.png');
            });
        }

        function markOverflows(baseElem){
            console.log('markOverflows for: ', baseElem);
            var children = baseElem.children();
            var overflowing = false;
            if ((baseElem[0].offsetHeight < baseElem[0].scrollHeight) || (baseElem[0].offsetWidth < baseElem[0].scrollWidth)) {
                //baseElem.css('background-color', 'yellow');
                baseElem.css('outline', 'dotted 5px red');
                overflowing = true;
            }else{
                baseElem.css('outline', '');
            }
            if (children.length) {
                children.each(function (index) {
                    /*if (isChildOverflowing(baseElem, $(this))) {
                        $(this).css('outline', 'dotted 5px purple')
                    }*/
                    overflowing =  markOverflows($(this)) || overflowing;
                });
            }
            return overflowing;

            function isChildOverflowing(parent, child){
                var parentRect = parent[0].getBoundingClientRect();
                var childRect = child[0].getBoundingClientRect();
                console.log('top: ' + parentRect.top + ', right: ' + parentRect.right + ', bottom: ' + parentRect.bottom + ', left: ' + parentRect.left);
                console.log('top: ' + childRect.top + ', right: ' + childRect.right + ', bottom: ' + childRect.bottom + ', left: ' + childRect.left);
                return childRect.left < parentRect.left
                    || childRect.right > parentRect.right
                    || childRect.top < parentRect.top
                    || childRect.bottom > parentRect.bottom;
            }
        }
    });
});