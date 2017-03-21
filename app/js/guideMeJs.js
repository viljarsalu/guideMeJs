(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else {
    // Browser globals
    factory(root);
  }
} (this, function (exports) {
    //Default config/variables
    var VERSION = '1.0';
    /**
    * GuideMe main class
    *
    * @class GuideMeJs
    */
    function GuideMeJs(obj) {
        this._targetElement = obj;
        this._guideItems = [];
        this._options = {
            /* Set the overlay opacity */
            overlayOpacity: 0.6,
            /* Default distancse from highlighted element. Value is pixels */
            tooltipOffset: 10,

            /* Default tooltip box position */
            tooltipPosition: 'bottom',
            /* CSS class that is added to the helperLayer */
            highlightClass: '',
            /* Close introduction when pressing Escape button? */
            exitOnEsc: true,
            /* Close introduction when clicking on overlay layer? */
            exitOnOverlayClick: true,
            /* Precedence of positions, when auto is enabled */
            positionPrecedence: ["bottom", "top", "right", "left"],
            /* Default hint position */
            hintPosition: 'top-middle'
        };

        var _allGuides = $(this._targetElement).find('[data-guideme-trigger]');
        
        //if there's no element to intro
        if (_allGuides.length < 1) {
            return false;
        }

        // Setup Data object. Data object is core object where store all important data about every guide element
        for(var i = _allGuides.length - 1; i >= 0; i--){
            var _obj = new Object();
            var _grp = $(_allGuides[i]).data('guidemeTrigger');
            var _elms = $(this._targetElement).find('[data-guideme-id^="'+_grp+'"]');
            
            _obj[_grp] = _obj[_grp] || {};
            _obj[_grp].all = _obj[_grp].all || {};
            _obj[_grp].visible = _obj[_grp].visible || {};
            _obj[_grp].visible = [];
            
            for (var j = _elms.length - 1; j >= 0; j--) {
                var _el = $(_elms[j]);
                var _originElDimensions = {
                    width: _getOffset(_el[0]).width,
                    height: _getOffset(_el[0]).height,
                    left:_el.offset().left,
                    top:_el.offset().top
                }
                // collect all elements
                _obj[_grp].all[$(_elms[j]).data('guidemeId')] = {
                    el: _el[0],
                    id: _el.data('guidemeId'),
                    text: _el.data('guidemeText'),
                    pos: _el.data('guidemePos'),
                    offset: _el.data('guidemeOffset') || this._options.tooltipOffset,
                    originElDimensions: _originElDimensions
                };
                // collect only visible elements
                if( _el.is(':visible') ) {
                    _obj[_grp].visible[_el.data('guidemeId')] = {
                        el: _el[0],
                        id: _el.data('guidemeId'),
                        text: _el.data('guidemeText'),
                        pos: _el.data('guidemePos'),
                        offset: _el.data('guidemeOffset') || this._options.tooltipOffset,
                        originElDimensions: _originElDimensions
                    };
                }
            }

            this._guideItems.push(_obj);
        };
    };
    /**
    * Find selected/current active guide's data from object and return id (data)
    *
    * @api private
    * @method _findGuideDataForElement
    * @param {String} object property name
    * @returns {Object}
    */
    function _findGuideDataForElement(objProp) {
        if( typeof(objProp) != 'string') {
            throw new Error('Method parameter for _findGuideDataForElement was not a string');
        }
        var objProp =  objProp; 
        var _data = {};      
        
        for( var i = 0; i < this._guideItems.length; i++ ) {
            if(this._guideItems[i].hasOwnProperty(objProp)){
                _data = this._guideItems[i];
            };
        }
        return _data;
    }
    /**
    * Need description
    *
    * @api private
    * @method _findGuideDataForElement
    * @param {Object} DOM element
    */
    function _guideForElement(el) {
        var _objProp =  $(el).data('guidemeTrigger');
        var _data = _findGuideDataForElement.call(this, _objProp);
        var _self = this;
        _addOverlayLayer.call(this, this._targetElement);

        /* TODO:
        * - add highlight layer
        * - add reference layer
        * - add tooltip layer
        * - show original element
        */

        $.each(_data, function(i, e){
            // show only all visible guides
            _showHighlightLayers.call(_self, e.visible);
            _showReferenceLayers.call(_self, e.visible);
        });
    }

    /**
    * Show highlight layer on the page
    *
    * @api private
    * @method _showHighlightLayers
    * @param {Object} Object
    */
    function _showHighlightLayers(obj) {
        for(var i in obj) {
            var $highlightLayer = $('<div class="guideme__highlight-layer" />');
            //$highlightLayer.attr('id', obj[i].id);
            _setLayerPosition.call(obj[i], $highlightLayer);
            $(this._targetElement).append($highlightLayer);
        }
    }

    /**
    * Show reference layer on the page
    *
    * @api private
    * @method _showReferenceLayers
    * @param {Object} Object
    */
    function _showReferenceLayers(obj) {
        for(var i in obj) {
            var $referenceLayer = $('<div class="guideme__tooltip-reference-layer"></div>');
            //$referenceLayer.attr('id', obj[i].id);
            _setLayerPosition.call(obj[i], $referenceLayer);
            // TODO: need better approach
            //$referenceLayer.css('width','');
            $(this._targetElement).append($referenceLayer);
            _showTooltipLayers.call(obj[i], $referenceLayer);
        }
    }

    /**
    * Show tooltip layer on the page
    *
    * @api private
    * @method _showTooltipLayers
    * @param {Object} Void
    */
    function _showTooltipLayers(el) {
        var $referenceLayer = $(el);
        var $tooltip = $('<div class="guideme__tooltip" />');
        /*$tooltip.css({
            top: this.originElDimensions.height
        });*/
        $tooltip.html(this.text);
        _setTooltipLayerPosition.call(this, $referenceLayer, $tooltip);
        $($referenceLayer).append($tooltip);
    }

    /**
    * Put canvas into reference layer
    *
    * @api private
    * @method _showArrow
    * @param {Object} Element
    */
    function _showArrow(refEl, tooltip) {
        var $pathIcon       = $('<span class="guideme__arrow"/>');//$('<i class="guideme__arrow di"></i>');
        var $referenceLayer = $(refEl);
        var $tooltip        = $(tooltip);
        var direct          = this.pos.split(' ').join('-');
        var space           = 20;
        var self            = this;
       
        $($referenceLayer).append($pathIcon);

        var pathIcon = $pathIcon[0];
        var posX = 0;
        var posY = 0;

        // pathIcon Positioning
        if( direct.split('-')[0] === 'top') {
            posY = 0 - self.offset;
            posX = space;
            $pathIcon.addClass('guideme__arrow--top');
            
            if( direct.split('-')[1] === 'center') {
                posX = this.originElDimensions.width/2 - (_getOffset($referenceLayer.find('.guideme__arrow')[0]).width/2);
            }
            if( direct.split('-')[1] === 'right') {
                posX = this.originElDimensions.width - _getOffset($referenceLayer.find('.guideme__arrow')[0]).width - space;
            }
        }

        if( direct.split('-')[0] === 'bottom' ) {
            posY = this.originElDimensions.height;//($tooltip.offset().top - self.originElDimensions.top >= 0 ? $tooltip.offset().top - self.originElDimensions.top : 0);
            posX = space;
            $pathIcon.addClass('guideme__arrow--bottom');

            if( direct.split('-')[1] === 'center') {
                posX = this.originElDimensions.width/2 - (_getOffset($referenceLayer.find('.guideme__arrow')[0]).width/2);
            }
            if( direct.split('-')[1] === 'right') {
                posX = this.originElDimensions.width - _getOffset($referenceLayer.find('.guideme__arrow')[0]).width - space;
            }
        }
        
        if( direct.split('-')[0] === 'right' ) {
            posY = (this.originElDimensions.height/2)-10;
            posX = (this.originElDimensions.width + this.offset) - $pathIcon.width() + 5;
            $pathIcon.addClass('guideme__arrow--right');
        }
        if( direct.split('-')[0] === 'left' ) {
            posY = (self.originElDimensions.height/2)-10;
            posX = 0 - self.offset;
            $pathIcon.addClass('guideme__arrow--left');
        }

        $pathIcon.css({
            top: posY,
            left: posX
        });

        return $pathIcon;
    }

    /**
    * Set new position to tooltip layer
    *
    * @api private
    * @method _setTooltipLayerPosition
    * @param {Object} Element
    */
    function _setTooltipLayerPosition(refEl, tooltipEl) {
        var _pos = this.pos.split(' ');
        
        // check position compination
        if(_pos[0] === 'top' || _pos[0] === 'bottom') {
            if(_pos[1]==='middle') {
                var _error = 'You cant use "' + _pos[0] + '" combination with "' + _pos[1] + '". Use "center" instead of "' + _pos[1] + '". Correct compination is "' + _pos[0] + ' center"';
                throw new Error(_error);
            }
        }
        if(_pos[0] === 'left' || _pos[0] === 'right') {
            if(_pos[1]==='center') {
                var _error = 'You cant use "' + _pos[0] + '" combination with "' + _pos[1] + '". Use "middle" instead of "' + _pos[1] + '". Correct compination is "' + _pos[0] + ' middle"';
                throw new Error(_error);
            }
        }

        var $refEl = refEl;
        var $tooltip = tooltipEl;
        var _dim = this.originElDimensions;
        var _styles = {};
        var _self = this;

        // TODO: need better approach
        switch(_pos[0]) {
            case 'top':
                setTimeout(function() {
                    $tooltip.css({
                        bottom: _self.originElDimensions.height + _self.offset
                    });
                }, 10);
            break;

            case 'right':
                setTimeout(function() {
                    $tooltip.css({
                        left: _self.originElDimensions.width + _self.offset
                    });
                }, 10);
            break;

            case 'bottom':
               setTimeout(function() {
                    $tooltip.css({
                        top: _self.originElDimensions.height + _self.offset
                    });
                }, 10);
            break;

            case 'left':
                setTimeout(function() {
                    $tooltip.css({
                        left: (_getOffset($tooltip[0]).width + _self.offset) * (-1) 
                    });
                }, 10);
            break;

        }
        // TODO: need better approach
        switch(_pos[1]) {
            case 'top':
                $tooltip.css({
                    top: 0
                });
            break;

            case 'right':
                setTimeout(function() {
                    $tooltip.css({
                        left: _self.originElDimensions.width - _getOffset($tooltip[0]).width
                    });
                }, 10);
            break;

            case 'bottom':
                setTimeout(function() {
                    $tooltip.css({
                        bottom: 0
                    });
                }, 10);
            break;

            case 'left':
                // default
            break;

            case 'center':
                setTimeout(function() {
                    $tooltip.css({
                        left: (_self.originElDimensions.width - _getOffset($tooltip[0]).width) / 2
                    });

                }, 10);
            break;

            case 'middle':
                setTimeout(function() {
                    $tooltip.css({
                        top: (_self.originElDimensions.height - _getOffset($tooltip[0]).height) / 2
                    });
                }, 10);
            break;
        }
        
        // TODO 
        setTimeout(function() {
            var $iconPath = _showArrow.call(_self, $refEl, $tooltip);
            $tooltip.addClass('in');
        }, 10);

        $tooltip.css(_styles);
        
    }
    /**
    * Set new position to layer
    *
    * @api private
    * @method _setLayerPosition
    * @param {Object} element
    */
    function _setLayerPosition(el) {
        var $targetEl = $(el);
        var _pos = this.originElDimensions;
        var _unit = 'px';
        $targetEl.css({
            top:    _pos.top    + _unit,
            left:   _pos.left   + _unit,
            width:  _pos.width  + _unit,
            height: _pos.height + _unit
        });
        $(this.el).addClass('guideme__relative-position guideme__show-element');  
    }

    /**
    * Add overlay layer to the page
    *
    * @api private
    * @method _addOverlayLayer
    * @param {Object} targetElm
    */
    function _addOverlayLayer(targetElm) {
        var $overlayLayer = $('<div class="guideme__overlay"/>'),
            styleText = '',
            self = this;

        //check if the target element is body, we should calculate the size of overlay layer in a better way
        if ($(targetElm)[0].nodeName.toLowerCase() === 'body') {
            $overlayLayer.css({
                    top:      '0',
                    right:    '0',
                    bottom:   '0',
                    left:     '0',
                    position: 'fixed'
                })
        } else {
            //set overlay layer position
            var elementPosition = _getOffset(targetElm);
            if (elementPosition) {
                $overlayLayer.css({
                    width:  elementPosition.width   + 'px', 
                    height: elementPosition.height  + 'px', 
                    top:    elementPosition.top     + 'px',
                    left:   elementPosition.left    + 'px'    
                })
            }
        }

        $(targetElm).append($overlayLayer);

        $overlayLayer.click(function(e){
            if (self._options.exitOnOverlayClick == true) {

                //check if any callback is defined
                if (self._introExitCallback != undefined) {
                    self._introExitCallback.call(self);
                }
                _exitGuideMode.call(self, targetElm);
            }
        });

        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                if (self._options.exitOnOverlayClick == true) {

                //check if any callback is defined
                if (self._introExitCallback != undefined) {
                    self._introExitCallback.call(self);
                }
                _exitGuideMode.call(self, targetElm);
            }
            }
        });

        setTimeout(function() {
            $overlayLayer.css({
                opacity: self._options.overlayOpacity.toString()
            });
        }, 10);

        return true;
    };
    /**
    * Exit from guide mode
    *
    * @api private
    * @method _exitGuideMode
    * @param {Object} targetElement
    */
    function _exitGuideMode(targetElement) {
        //remove overlay layer from the page
        var $overlayLayer = $(targetElement).find('.guideme__overlay');

        //return if guideme already completed or skipped
        if (!$overlayLayer.length) {
            return;
        }

        //for fade-out animation
        $overlayLayer.css('opacity', '0');
        setTimeout(function () {
            if ($overlayLayer.length) {
                $overlayLayer.remove();
            }
        }, 500);
        //remove all highlight layers
        var $highlightLayer = $('.guideme__highlight-layer');
        if ($highlightLayer.length) {
            $highlightLayer.remove();
        }
        //remove `guideme-showElement` class from the element
        var $showElement = $('.guideme__show-element');
        if ($showElement.length) {
          $showElement.removeClass('guideme__relative-position guideme__show-element');
        }
        // remove 'reference layer'
        var $referenceLayer = $('.guideme__tooltip-reference-layer');
        if ($referenceLayer.length) {
          $referenceLayer.remove();
        }
        /*
        //remove disableInteractionLayer
        var disableInteractionLayer = targetElement.querySelector('.introjs-disableInteraction');
        if (disableInteractionLayer) {
          disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
        }

        //remove intro floating element
        var floatingElement = document.querySelector('.introjsFloatingElement');
        if (floatingElement) {
          floatingElement.parentNode.removeChild(floatingElement);
        }

        //remove `introjs-fixParent` class from the elements
        var fixParents = document.querySelectorAll('.introjs-fixParent');
        if (fixParents && fixParents.length > 0) {
          for (var i = fixParents.length - 1; i >= 0; i--) {
            fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
          }
        }

        //clean listeners
        if (window.removeEventListener) {
          window.removeEventListener('keydown', this._onKeyDown, true);
        } else if (document.detachEvent) { //IE
          document.detachEvent('onkeydown', this._onKeyDown);
        }

        //set the step to zero
        this._currentStep = undefined;*/
    }
    /**
    * Get an element position on the page
    * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
    *
    * @api private
    * @method _getOffset
    * @param {Object} element
    * @returns Element's position info
    */
    function _getOffset(element) {
        var elementPosition = {};
        //set width
        elementPosition.width = element.offsetWidth;
        //set height
        elementPosition.height = element.offsetHeight;
        //calculate element top and left
        var _x = 0;
        var _y = 0;
        while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
            _x += element.offsetLeft;
            _y += element.offsetTop;
            element = element.offsetParent;
        }
        //set top
        elementPosition.top = _y;
        //set left
        elementPosition.left = _x;
        return elementPosition;
    };

    /**
    * Check is element in viewport
    * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    *
    * @api private
    * @method _elementInViewport
    * @param {Object} Element
    */
    function _elementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            (rect.bottom+80) <= window.innerHeight && // add 80 to get the text right
            rect.right <= window.innerWidth
        );
    }

    var guideMeJs = function (targetElm) {
        if (typeof (targetElm) === 'object') {
            //Ok, create a new instance
            return new GuideMeJs(targetElm);

        } else if (typeof (targetElm) === 'string') {
            //select the target element with query selector
            var targetElement = document.querySelector(targetElm);

            if (targetElement) {
                return new GuideMeJs(targetElement);
            } else {
                throw new Error('There is no element with given selector.');
            }
        } else {
            return new GuideMeJs(document.body);
        }
    };


    /**
    * Current IntroJs version
    *
    * @property version
    * @type String
    */
    guideMeJs.version = VERSION;

    guideMeJs.fn = GuideMeJs.prototype = {
        show: function(el) {
            _guideForElement.call(this, el);
            return this;
        }
    }

    exports.guideMeJs = guideMeJs;
    return guideMeJs;

}));