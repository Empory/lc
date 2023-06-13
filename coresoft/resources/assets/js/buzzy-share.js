import "./plugins";
(function($, window, document) {
  "use strict";

  window.Buzzy = window.Buzzy || {};

  window.Buzzy.Share = {
    xhr: null,

    // initializes main settings
    handleInit: function() {},

    // initializes main settings
    handleClicks: function() {
      var base = this;

      //share buttons
      $("body").on(
        {
          click: function() {
            var $this = $(this),
              dataShareType = $this.attr("data-share-type"),
              dataType = $this.attr("data-type"),
              dataId = $this.attr("data-id"),
              dataPostUrl = $this.attr("data-post-url"),
              dataTitle = $this.attr("data-title"),
              dataSef = $this.attr("data-sef");

            switch (dataShareType) {
              case "facebook":
                shareWindow(
                  "https://www.facebook.com/share.php?u=" +
                    encodeURIComponent(dataSef)
                );
                base.updateShareCount(
                  dataPostUrl,
                  dataId,
                  dataType,
                  dataShareType
                );
                break;

              case "twitter":
                shareWindow(
                  "https://twitter.com/intent/tweet?text=" +
                    encodeURIComponent(dataTitle) +
                    "%E2%96%B6" +
                    encodeURIComponent(dataSef)
                );
                base.updateShareCount(
                  dataPostUrl,
                  dataId,
                  dataType,
                  dataShareType
                );
                break;

              case "pinterest":
                var image = $("meta[property=og\\:image]").attr("content");

                shareWindow(
                  "http://pinterest.com/pin/create/button/?url=" +
                    encodeURIComponent(dataSef) +
                    "&media=" +
                    encodeURIComponent(image) +
                    "&description=" +
                    encodeURIComponent(dataTitle)
                );
                base.updateShareCount(
                  dataPostUrl,
                  dataId,
                  dataType,
                  dataShareType
                );
                break;

              case "mail":
                window.location.href =
                  "mailto:?subject=" +
                  encodeURIComponent(dataTitle) +
                  "&body=" +
                  encodeURIComponent(dataSef);
                base.updateShareCount(
                  dataPostUrl,
                  dataId,
                  dataType,
                  dataShareType
                );
                break;

              case "whatsapp":
                window.location.href =
                  "whatsapp://send?text=" +
                  encodeURIComponent(dataTitle) +
                  "%E2%96%B6" +
                  encodeURIComponent(dataSef);
                base.updateShareCount(
                  dataPostUrl,
                  dataId,
                  dataType,
                  dataShareType
                );
                break;

                case "whatsappweb":
                    window.location.href =
                        "https://api.whatsapp.com/send?text==" +
                        encodeURIComponent(dataTitle) +
                        "%E2%96%B6" +
                        encodeURIComponent(dataSef);
                    base.updateShareCount(
                        dataPostUrl,
                        dataId,
                        dataType,
                        dataShareType
                    );
                    break;
            }

            function shareWindow(url) {
              window.open(
                url,
                "_blank",
                "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400"
              );
            }
          },
        },
        ".buzz-share-button"
      );
    },

    // Handle Jscroll
    updateShareCount: function(dataPostUrl, dataId, dataType, dataShareType) {
      var base = this;
      if (base.xhr !== null) return;

      base.xhr = $.ajax({
        type: "POST",
        url: dataPostUrl,
        data: {
          contentId: dataId,
          contentType: dataType,
          shareType: dataShareType,
          _token: $("#requesttoken").val(),
        },
        success: function(data) {
          if ($(".video-showcase").length > 0) {
            var $container = $(".video-showcase");
          } else if ($('article[data-id="' + dataId + '"]').length > 0) {
            var $container = $('article[data-id="' + dataId + '"]');
          } else if (
            $('.buzz-share-item[data-id="' + dataId + '"]').length > 0
          ) {
            var $container = $('.buzz-share-item[data-id="' + dataId + '"]');
          } else {
            $container = null;
          }

          //var $container = dataType == 'video' ? $('.video-showcase') : $('article[data-id="' + dataId + '"]');

          if ($container != null && $container.length > 0) {
            var $badged = $container.find(".buzz-share-badge-" + dataShareType);

            var $headerCount = $(".content-header").find(".buzz-share-count"),
              $containerCount = $container.find(".buzz-share-count"),
              value = parseInt($containerCount.html()) + 1;

            $container.data("share", value);
            //$containerCount.html(value);

            if ($headerCount.length > 0) {
              //$headerCount.html(value);
            }

            if (
              $badged.length > 0 &&
              (dataShareType == "facebook" || dataShareType == "twitter")
            ) {
              if ($badged.hasClass("is-visible")) {
                //$badged.html(data);
              } else {
                //$badged.addClass('is-visible').html(data);
              }
            }
          }
        },
      }).always(function() {
        base.xhr = null;
      });
    },

    // Handle Jscroll
    handleOnPopup: function(href, id, type) {
      if (href > "") {
        var winWidth = 600;
        var winHeight = 400;
        var winTop = screen.height / 2 - winHeight / 2;
        var winLeft = screen.width / 2 - winWidth / 2;
        var win = window.open(
          href,
          "sharer",
          "top=" +
            winTop +
            ",left=" +
            winLeft +
            ",toolbar=0,status=0,width=" +
            winWidth +
            ",height=" +
            winHeight
        );

        var timer = setInterval(function() {
          if (win.closed) {
            clearInterval(timer);

            $.ajax({
              method: "POST",
              data: {
                contentId: id,
                shareType: type,
                _token: $("#requesttoken").val(),
              },
              url: "/shared",
              success: function(json) {},
            });
          }
        }, 1000);
        return false;
      }
    },

    postToFeed: function() {
      var base = this;
      $(".postToFacebookFeed")
        .off("click")
        .on("click", function(e) {
          var activeresult = $(this);
          var datalink = activeresult.attr("data-link");
          var dataname = activeresult.attr("data-iname");
          var datapicture = activeresult.attr("data-picture");
          var datadescription = activeresult.attr("data-description");

          base.postToFacebook(datalink, dataname, datapicture, datadescription);

          return false;
        });

      $(".postToResultFeed")
        .off("click")
        .on("click", function(e) {
          var activeresult = $(".quiz_result.active");
          var datalink = activeresult.attr("data-link");
          var dataname = activeresult.attr("data-name");
          var datainame = activeresult.attr("data-iname");
          var dataitname = activeresult.attr("data-itname");
          var datapicture = activeresult.attr("data-picture");
          var datadescription = activeresult.attr("data-description");

          if (dataname == "") {
            dataname = activeresult.find(".quiz_headline").text();
            datainame = dataname;
            dataitname = dataname;
          }

          if ($(this).hasClass("Facebook")) {
            base.postToFacebook(
              datalink,
              datainame,
              datapicture,
              datadescription
            );
          } else if ($(this).hasClass("Pinterest")) {
            base.postToPinterest(
              datalink,
              datainame,
              datapicture,
              datadescription
            );
          } else {
            base.postToTwitter(datalink, dataitname);
          }

          return false;
        });
    },

    postToFacebook: function(datalink, dataname, datapicture, datadescription) {
      swal({
        title: "",
        timer: 1,
      });

      FB.ui(
        {
          method: "share",
          href: datalink,
          quote: dataname + "  " + datadescription,
        },
        function(response) {
          if (response && !response.error_message) {
            swal({
              title: BuzzyQuizzes.lang_5,
              text: BuzzyQuizzes.lang_6,
              html: true,
              type: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
          }
        }
      );

      return false;
    },

    postToTwitter: function(datalink, dataname) {
      this.handleOnPopup(
        "https://twitter.com/intent/tweet?url=" +
          datalink +
          "&text=" +
          dataname,
        $(".news__item").attr("data-id"),
        "twitter"
      );

      return false;
    },

    postToPinterest: function(datalink, dataname, datapicture) {
      this.handleOnPopup(
        "https://pinterest.com/pin/create/link/?url=" +
          datalink +
          "&media=" +
          datapicture +
          "&description=" +
          dataname,
        $(".news__item").attr("data-id"),
        "pinterest"
      );

      return false;
    },

    init: function() {
      this.handleClicks();

      this.postToFeed();
    },

    //Ajax plugins reinstall function.
    initAjax: function() {
      this.handleClicks();

      this.postToFeed();
    },
  };
})(jQuery, window, document);
