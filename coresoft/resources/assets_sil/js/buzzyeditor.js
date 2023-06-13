/*! Buzzy | buzzyeditor.js
 * ================
 * Script Name: Buzzy
 * Script URI: http://buzzy.akbilisim.com/
 * Author: akbilisim.com
 * Author URI: http://www.akbilisim.com
 * Version: 1.0
 * License: GNU General Public License
 * License URI: http://buzzy.akbilisim.com/license.html
 * (C) 2015 akbilisim.com.
 */
import Sortable from 'sortablejs';
import 'selectize/dist/js/standalone/selectize.js';
import 'jquery-form';
import 'air-datepicker';
import { slugify } from 'transliteration';
var isRtl = jQuery('html').attr('dir') === 'rtl';
(function ($, window, document) {
    'use strict';

    window.BuzzyEditor = window.BuzzyEditor || {};

    window.BuzzyEditor = {
        handleSelectize: function () {
            var xhr_tag = null;
            var selectize_plugins = ['restore_on_backspace', 'remove_button'];

            if ($('.buzzeditor').hasClass('create-mode')) {
                selectize_plugins.push('drag_drop');
            }

            $('#tags').selectize({
                plugins: selectize_plugins,
                delimiter: ',',
                valueField: 'name',
                labelField: 'name',
                searchField: ['name'],
                create: function (input) {
                    return {
                        name: input
                    };
                },
                load: function (query, callback) {
                    if (!query.length) return callback();

                    xhr_tag && xhr_tag.abort();
                    xhr_tag = $.ajax({
                        url: BuzzyEditorVars.tags_ajax,
                        type: 'POST',
                        data: {
                            q: query,
                            _token: $('#requesttoken').val()
                        },
                        error: function () {
                            callback();
                        },
                        success: function (res) {
                            callback(res);
                        }
                    });
                }
            });

            $('#tagcats').selectize({
                plugins: selectize_plugins,
                persist: false,
                maxItems: 20,
                valueField: 'id',
                labelField: 'name',
                searchField: ['id', 'name'],
                sortField: 'text',
                create: false
            });
        },
        handlePublishDatePicker: function () {
            $.fn.datepicker.language['en'] = {
                days: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ],
                daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                monthsShort: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                today: 'Today',
                clear: 'Publish Immediately',
                firstDay: 0
            };

            $('#published_at').datepicker({
                language: 'en',
                dateFormat: 'yyyy-mm-dd',
                timeFormat: 'hh:ii:00',
                position: 'bottom center',
                minDate: new Date(BuzzyEditorVars.current_publish_server_time),
                timepicker: true,
                autoClose: true,
                clearButton: true
            });
        },

        handleSlugify: function (value) {
            value = value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/\.+/g, '-')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '') // Trim - from start of text
                .replace(/-+$/, '');

            if (BuzzyEditorVars.use_latin_slug) {
                value = slugify(value);
                value = value.replace(/[^\w\-]+/g, ''); // Remove all non-word chars
            }
            return value;
        },

        handleSlugClicks: function () {
            var _this = this;
            // only start automatic change slug with headline create mode
            var edited_slug = $('.buzzeditor').hasClass('create-mode');

            $('.post_slug_edit').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('.slug-container').toggleClass('show_input');
            });

            $('#post_slug_input').on('keyup change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var val = $(this).val();
                $('.post_slug').text(_this.handleSlugify(val));
            });

            $('input[name="headline"]').on('keyup change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (edited_slug) {
                    var val = $(this).val();
                    $('.post_slug').text(_this.handleSlugify(val));
                    $('#post_slug_input').val(_this.handleSlugify(val));
                }
            });

            $('#post_slug_save').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                edited_slug = false; // block title changes
                $('.slug-container').toggleClass('show_input');
                $('#post_slug_input').val(
                    _this.handleSlugify($('#post_slug_input').val())
                );
            });
            $('#post_slug_use_title').on('click', function () {
                edited_slug = true; // use title changes
                $('.slug-container').toggleClass('show_input');
                $('#post_slug_input')
                    .val(_this.handleSlugify($('input[name="headline"]').val()))
                    .trigger('change');
            });
        },

        // initializes main settings
        handleEntryClicks: function () {
            var _this = this;

            $('.lists-types a').on('click', function (e) {
                $('.lists-types a')
                    .removeClass('selected')
                    .addClass('button-white')
                    .removeClass('button-gray');

                $(this)
                    .addClass('selected')
                    .removeClass('button-white')
                    .addClass('button-gray');

                _this.handleOrderNumbers();
            });

            $('.moreentry')
                .off('click')
                .on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var moreentry = $(this);
                    var moreentrywidget = $('.moreentrywidget');

                    if (!moreentrywidget.hasClass('show')) {
                        moreentrywidget.addClass('show');
                        moreentry.find('i').attr('class', 'fa fa-caret-up');
                    } else {
                        moreentrywidget.removeClass('show');
                        moreentry.find('i').attr('class', 'fa fa-caret-down');
                    }
                });

            $('.moredetail .trigger')
                .off('click')
                .on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!$(this).hasClass('active')) {
                        $(this).parent().find('.detailhide').slideDown('fast');
                        $(this).addClass('active');
                        $(this).find('.up').show();
                        $(this).find('.down').hide();
                    } else if ($(this).hasClass('active')) {
                        $(this).parent().find('.detailhide').slideUp('fast');
                        $(this).removeClass('active');
                        $(this).find('.up').hide();
                        $(this).find('.down').show();
                    }
                });

            $('.up-down-trigger').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var del = $(this);
                var entry = del.parents('.entry');

                if ($(entry).find('.tox-tinymce').length != 0) {
                    $(entry)
                        .find('.message')
                        .each(function () {
                            tinymce.remove('#' + $(this).attr('id'));
                        });
                }

                if (del.hasClass('up-entry')) {
                    var entrytop = entry.prev();
                    entry.insertBefore(entrytop);
                } else if (del.hasClass('down-entry')) {
                    var entrybottom = entry.next();
                    entry.insertAfter(entrybottom);
                }

                _this.handleOrderNumbers();
                _this.handleTextEditor();
            });

            $('.getassignres').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.handleAssignSelect();
            });
            $('.clickanswertype').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var listtype = $(this).attr('data-style');
                $(this)
                    .parents('.questionmore')
                    .find('a')
                    .removeClass('button-orange')
                    .addClass('button-white')
                    .removeAttr('data-curtype');
                $(this)
                    .removeClass('button-white')
                    .addClass('button-orange')
                    .attr('data-curtype', 'on');
                $(this)
                    .parents('.questionmore')
                    .find('.answers')
                    .attr('class', 'answers ' + listtype);
            });

            $('.delete-entry').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var del = $(this);
                swal(
                    {
                        title: BuzzyEditorlang.lang_1,
                        text: BuzzyEditorlang.lang_2,
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: BuzzyEditorlang.lang_3,
                        cancelButtonText: BuzzyEditorlang.lang_4,
                        closeOnConfirm: true,
                        html: true
                    },
                    function () {
                        if (del.attr('data-block') == 'entry') {
                            del.parents('.entry').first().remove();
                        } else {
                            del.parents('.answer').first().remove();
                        }

                        _this.handleOrderNumbers();
                    }
                );
            });

            $('.thumbactions a.deleteimage').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var actionsbut = $(this);
                var action = $(this).attr('data-action');
                var actiontarget = $(this).attr('data-target');

                swal(
                    {
                        title: BuzzyEditorlang.lang_1,
                        type: 'warning',
                        showCancelButton: true,
                        html: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: BuzzyEditorlang.lang_3,
                        cancelButtonText: BuzzyEditorlang.lang_4,
                        closeOnConfirm: true
                    },
                    function () {
                        if (actiontarget == 'thumb') {
                            $('.imagepr_wrap').html('');
                            $('.previewshow').hide();
                            $('.preview-placeholder').show();
                            $('#upwthumb').val('');
                        } else if (actiontarget == 'thumb_main_slide') {
                            $('.imagepr_wrap_main_slide').html('');
                            $('.previewshow_main_slide').hide();
                            $('.preview-placeholder-main_slide').show();
                            $('#upwthumb_main_slide').val('');
                        } else {
                            var answe = '.entry';
                            if (actiontarget == 'answer') {
                                answe = '.answer';
                            }

                            actionsbut
                                .parents(answe)
                                .find('.imagearea_img')
                                .first()
                                .html('');
                            actionsbut
                                .parents(answe)
                                .find('.cd-input-image')
                                .first()
                                .val('');
                            actionsbut.parents(answe).find('.mediaupload').first().show();
                            actionsbut
                                .parents(answe)
                                .find('.imagearea')
                                .first()
                                .addClass('hide');
                        }
                    }
                );
            });

            $('.thumbactions a.makepreview').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var inputValue = $(this)
                    .parents('.entry')
                    .find('[data-type="image"]')
                    .val();

                $('.imagepr_wrap').html('');
                $('.previewshow').hide();
                $('.preview-placeholder').show();
                $('#upwthumb').val('');

                _this.handleImageUploadToPreviews(inputValue);


                var inputValue2 = $(this)
                    .parents('.entry')
                    .find('[data-type="image"]')
                    .val();

                $('.imagepr_wrap_main_slide').html('');
                $('.previewshow_main_slide').hide();
                $('.preview-placeholder-main_slide').show();
                $('#upwthumb_main_slide').val('');

                _this.handleImageUploadToPreviewsMainSlide(inputValue2);




            });

            $('.getimageurl').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var input = $(this);
                var actiontarget = $(this).attr('data-target');

                swal(
                    {
                        title: BuzzyEditorlang.lang_5,
                        type: 'input',
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: 'slide-from-top',
                        html: true,
                        inputPlaceholder: BuzzyEditorlang.lang_6,
                        confirmButtonText: BuzzyEditorlang.lang_15,
                        cancelButtonText: BuzzyEditorlang.lang_4
                    },
                    function (inputValue) {
                        if (inputValue === false) return false;

                        if (inputValue === '') {
                            swal.showInputError(BuzzyEditorlang.lang_7);
                            return false;
                        }

                        if (inputValue.match(/\.(jpeg|jpg|gif|png|webp)$/) != null) {
                            if (actiontarget == 'preview') {
                                _this.handleImageUploadToPreviews(inputValue);
                            } else {
                                _this.handleImageUploadToEntryImage(input, inputValue);
                            }

                            swal({
                                title: '',
                                timer: 10
                            });
                        } else {
                            swal.showInputError(BuzzyEditorlang.lang_8);
                            return false;
                        }
                    }
                );
            });

            $('.getcontenturl').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var input = $(this);
                var actiontarget = $(this).attr('data-target');

                _this.handleGetContent('');
            });

            $('.getquizurl').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var input = $(this);
                var actiontarget = $(this).attr('data-target');

                _this.handleGetContent(actiontarget);
            });
        },

        handleGetContent: function (type) {
            var _this = this;
            var isQuiz = type === 'quiz' || type === 'personality' || type === 'trivia';
            swal(
                {
                    title: BuzzyEditorlang.lang_13,
                    type: 'input',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    html: true,
                    animation: 'slide-from-top',
                    inputPlaceholder: BuzzyEditorlang.lang_14,
                    confirmButtonText: BuzzyEditorlang.lang_15,
                    cancelButtonText: BuzzyEditorlang.lang_4,
                    showLoaderOnConfirm: true
                },
                function (inputValue) {
                    if (inputValue === false) return false;

                    if (inputValue === '') {
                        swal.showInputError(BuzzyEditorlang.lang_7);
                        return false;
                    }

                    if (
                        inputValue.match(
                            /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
                        ) != null
                    ) {
                        NProgress.inc();
                        Buzzy.initLoadingCaption('show');

                        $.get(
                            '/get_content_data',
                            {
                                dataurl: inputValue,
                                type: type,
                                _token: $('#requesttoken').val()
                            },
                            function (response) {
                                if (response.status === 'error') {
                                    swal({
                                        title: response.title || 'Error',
                                        text: response.error,
                                        type: 'error',
                                        html: true,
                                        timer: 2000
                                    });
                                } else {
                                    var form = $('.question-post-form');

                                    if (response.headline) {
                                        form.find('input[name=headline]').val(
                                            response.headline
                                        );

                                        $('.post_slug').text(
                                            _this.handleSlugify(response.headline)
                                        );
                                        $('#post_slug_input').val(
                                            _this.handleSlugify(response.headline)
                                        );
                                    }

                                    if (response.description) {
                                        form.find('textarea[name=description]').val(
                                            response.description
                                        );
                                    }

                                    if (response.tags) {
                                        var selectized = $('#tags').selectize();
                                        var control = selectized[0].selectize;

                                        control.destroy();

                                        $('#tags').val(response.tags);

                                        _this.handleSelectize();
                                    }

                                    if (response.preview) {
                                        form.find('input[name=thumb]').val(
                                            response.preview
                                        );
                                        _this.handleImageUploadToPreviews(
                                            response.preview
                                        );
                                    }

                                    if (response.entries) {
                                        if (isQuiz) {
                                            form.find('#results').html(response.results);
                                        }
                                        form.find('#entries').html(response.entries);
                                    }

                                    setTimeout(function () {
                                        _this.initAjax();
                                        swal({
                                            title: '',
                                            timer: 100
                                        });
                                    }, 1000);
                                }
                                NProgress.done(true);
                                Buzzy.initLoadingCaption('hide');
                            },
                            'json'
                        );
                    } else {
                        swal.showInputError(BuzzyEditorlang.lang_8);
                        return false;
                    }
                }
            );
        },

        // initializes  editor
        handleTextEditor: function () {
            $('.message').each(function (index, element) {
                if (BuzzyEditorVars.editor_type === 'froala') {
                    if ($(this).parents('.entry').find('.fr-box').length == 0) {
                        new FroalaEditor(element, {
                            codeMirrorOptions: {
                                tabSize: 4
                            },
                            key: BuzzyEditorVars.editor_froala_key,
                            language: BuzzyEditorVars.editor_language.toLowerCase(),
                            direction: isRtl ? 'rtl' : 'ltr',
                            charCounterCount: false,
                            imageInsertButtons: [
                                'imageBack',
                                '|',
                                'imageUpload',
                                'imageByURL'
                            ],
                            imageUploadMethod: 'POST',
                            imageUploadURL:
                                BuzzyEditorVars.image_upload_request +
                                '?type=entry&path_key=link',
                            imageUploadParam: 'file',
                            imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
                            // Set max image size to 5MB.
                            imageMaxSize: 5 * 1024 * 1024,
                            // Additional upload params.
                            imageUploadParams: { _token: $('#requesttoken').val() },
                            toolbarBottom: false,
                            attribution: false,
                            emoticonsUseImage: false,
                            heightMin: 200,
                            toolbarButtons: {
                                moreText: {
                                    buttons: [
                                        'bold',
                                        'italic',
                                        'underline',
                                        'strikeThrough',
                                        'subscript',
                                        'superscript',
                                        'fontFamily',
                                        'fontSize',
                                        'textColor',
                                        'backgroundColor',
                                        'inlineClass',
                                        'inlineStyle',
                                        'clearFormatting'
                                    ]
                                },
                                moreParagraph: {
                                    buttons: [
                                        'alignLeft',
                                        'alignCenter',
                                        'formatOLSimple',
                                        'alignRight',
                                        'alignJustify',
                                        'formatOL',
                                        'formatUL',
                                        'paragraphFormat',
                                        'paragraphStyle',
                                        'lineHeight',
                                        'outdent',
                                        'indent',
                                        'quote'
                                    ]
                                },
                                moreRich: {
                                    buttons: [
                                        'insertLink',
                                        'insertImage',
                                        'insertVideo',
                                        'insertTable',
                                        'emoticons',
                                        'fontAwesome',
                                        'specialCharacters',
                                        'embedly',
                                        'insertHR'
                                    ]
                                },
                                moreMisc: {
                                    buttons: [
                                        'undo',
                                        'redo',
                                        'fullscreen',
                                        'print',
                                        'getPDF',
                                        'spellChecker',
                                        'selectAll',
                                        'html',
                                        'help'
                                    ],
                                    align: 'right',
                                    buttonsVisible: 2
                                }
                            }
                        });
                    }
                } else if (BuzzyEditorVars.editor_type === 'tinymce') {
                    if ($(this).parents('.entry').find('.tox-tinymce').length == 0) {
                        tinymce.init({
                            target: element,
                            language: BuzzyEditorVars.editor_language,
                            directionality: isRtl ? 'rtl' : 'ltr',
                            images_upload_url:
                                BuzzyEditorVars.image_upload_request +
                                '?type=entry&path_key=location&_token=' +
                                $('#requesttoken').val(),
                            menubar: false,
                            statusbar: false,
                            min_height: 300,
                            default_link_target: '_blank',
                            plugins:
                                'save print preview importcss searchreplace autoresize autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons codeeditor',
                            toolbar:
                                'formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | numlist bullist checklist | image media link |  undo redo | fontselect fontsizeselect | outdent indent | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak codesample | charmap emoticons | paste copy fullscreen preview print codeeditor',
                            setup: function (editor) {
                                editor.on('change blur', function (e) {
                                    editor.save();
                                    tinymce.triggerSave();
                                });
                            }
                        });

                        $(element).parent().css('display', 'grid');
                    }
                } else {
                    if ($(this).parents('.entry').find('.simditor').length == 0) {
                        Simditor.locale = 'en_EN';
                        new Simditor({
                            textarea: $(element),
                            defaultImage: '/assets/images/bggray.png',
                            upload: false,
                            pasteImage: true,
                            tabIndent: false,
                            toolbar: [
                                'title',
                                'bold',
                                'italic',
                                'underline',
                                'strikethrough',
                                'color',
                                '|',
                                'ol',
                                'ul',
                                'blockquote',
                                'link',
                                'image',
                                '|',
                                'code',
                                'table',
                                'hr',
                                'indent',
                                'outdent',
                                'alignment'
                            ],
                            toolbarFloat: false,
                            toolbarFloatOffset: 35
                        });
                    }
                }
            });
        },

        // initializes main settings
        handleNewEntryClick: function () {
            var _this = this;
            var pot = $('.entry_fetch');

            pot.off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                NProgress.set(0.4);

                var type = $(this).attr('data-type');
                var adress = $(this).attr('href');
                var methot = $(this).attr('data-method');
                var target = $(this).attr('data-target');
                var puttype = $(this).attr('data-puttype');
                var token = $('#requesttoken').val();

                $.ajax({
                    method: methot,
                    data: '_token=' + token,
                    url: adress,
                    success: function (success) {
                        if (success.error) {
                            alert(success.message);
                            return false;
                        }

                        if (puttype == 'prepend') {
                            $('#' + target).prepend(success);
                        } else if (puttype == 'append') {
                            $('#' + target).append(success);
                        } else {
                            $('#' + target).html(success);
                        }

                        // re init editor
                        setTimeout(function () {
                            _this.initAjax();
                        }, 100);

                        NProgress.done(true);
                    },
                    error: function (success) {
                        NProgress.done(true);
                    }
                });

                return false;
            });
        },

        handleImageUploadToPreviews: function (image) {
            if ($('#upwthumb').val() == '') {
                $('.imagepr_wrap').html('<img src="' + image + '" >');
                $('.previewshow').show();
                $('.preview-placeholder').hide();
                $('#upwthumb').val(image);
            }
        },

        handleImageUploadToPreviewsMainSlide: function (image) {
            if ($('#upwthumb_main_slide').val() == '') {
                $('.imagepr_wrap_main_slide').html('<img src="' + image + '" >');
                $('.previewshow_main_slide').show();
                $('.preview-placeholder-main_slide').hide();
                $('#upwthumb_main_slide').val(image);
            }
        },

        handleImageUploadToEntryImage: function (input, image) {
            var target = input.attr('data-target');

            input
                .parents('.' + target)
                .find('.imagearea_img')
                .first()
                .html('<img src="' + image + '" >');
            input
                .parents('.' + target)
                .find('.cd-input-image')
                .first()
                .val(image);
            input.parents('.inpunting').hide();
            input
                .parents('.' + target)
                .find('.imagearea')
                .first()
                .removeClass('hide');
        },

        // image upload
        handleImageUpload: function () {
            var _this = this;
            $('.uploadaimage')
                .off('click')
                .on('change', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    NProgress.inc();
                    Buzzy.initLoadingCaption('show');

                    var input = $(this);
                    input
                        .attr('name', 'file')
                        .parents('form')
                        .attr('method', 'POST')
                        .attr('enctype', 'multipart/form-data');

                    var token = $("input[name='_token']").val();
                    input
                        .parents('form')
                        .append(
                            '<input name="_token" type="hidden" value="' + token + '">'
                        );

                    var request_url =
                        BuzzyEditorVars.image_upload_request +
                        '?type=' +
                        input.attr('data-target');

                    input.parents('form').ajaxSubmit({
                        url: request_url,
                        dataType: 'json',
                        success: function (response) {
                            if (response.error) {
                                swal({
                                    title: BuzzyEditorlang.lang_11,
                                    text: response.error,
                                    type: 'error',
                                    html: true,
                                    showCancelButton: false,
                                    confirmButtonText: BuzzyEditorlang.lang_15
                                });
                            } else {
                                if (input.hasClass('preview')) {
                                    _this.handleImageUploadToPreviews(response.path);
                                } else if (input.hasClass('preview_main_slide')) {
                                    _this.handleImageUploadToPreviewsMainSlide(response.path);
                                } else {
                                    _this.handleImageUploadToEntryImage(
                                        input,
                                        response.path
                                    );

                                    _this.handleImageUploadToPreviews(response.path); //eğer entry resim yüklendiğinde preview yok ise orayada ata..
                                }
                            }

                            Buzzy.initLoadingCaption('hide');
                            NProgress.done(true);
                        },
                        error: function () {
                            swal({
                                title: BuzzyEditorlang.lang_11,
                                text: BuzzyEditorlang.lang_9,
                                type: 'error',
                                html: true,
                                showCancelButton: false,
                                confirmButtonText: BuzzyEditorlang.lang_15
                            });

                            Buzzy.initLoadingCaption('hide');
                            NProgress.done(true);
                        }
                    });
                });
        },

        handleEmbedArea: function (thisurl, showhtml, input, title = '') {
            $(thisurl).parents('.inpunting').hide();
            $(thisurl).parents('.entry').find('.embedarea').removeClass('hide');
            $(thisurl).parents('.entry').find('.videoembed').html(showhtml);
            $(thisurl)
                .parents('.entry')
                .find('[data-type="video"]')
                .val(input)
                .trigger('change');

            if (title) {
                $(thisurl).parents('.entry').find('input[data-type="title"]').val(title);
            }
        },

        handleEmbedRequest: function (el, url, type) {
            var _this = this;

            if (url == '') {
                swal({
                    title: BuzzyEditorlang.lang_11,
                    text: BuzzyEditorlang.lang_9,
                    type: 'warning',
                    timer: 2000,
                    html: true,
                    showCancelButton: false,
                    confirmButtonText: BuzzyEditorlang.lang_15
                });
                return false;
            }
            NProgress.inc();
            Buzzy.initLoadingCaption('show');

            var req = $.post(
                BuzzyEditorVars.fetch_video_request,
                {
                    url: url,
                    _token: $('#requesttoken').val()
                },
                function (response) {
                    if (response.status === 'error') {
                        swal({
                            title: BuzzyEditorlang.lang_11,
                            text: response.message,
                            type: 'warning',
                            timer: 2000,
                            html: true,
                            showCancelButton: false,
                            confirmButtonText: BuzzyEditorlang.lang_15
                        });
                    } else {
                        if (response.html) {
                            _this.handleEmbedArea(
                                el,
                                response.html,
                                response.url,
                                response.title
                            );
                        }

                        if (response.image) {
                            _this.handleImageUploadToPreviews(response.image);
                        }

                        setTimeout(function () {
                            FB.XFBML.parse();
                        }, 1000);
                    }
                },
                'json'
            )
                .fail(function (response) {
                    swal({
                        title: response.title,
                        text: response.message,
                        type: 'error',
                        html: true,
                        showCancelButton: false,
                        confirmButtonText: BuzzyEditorlang.lang_15
                    });
                })
                .always(function () {
                    Buzzy.initLoadingCaption('hide');
                    NProgress.done(true);
                });
        },

        //  video embed create
        handleEmbedGetClick: function () {
            var _this = this;
            $('.create_embed').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var el = $(this);
                var url = $(this).parent('div').find('input').val();
                var type = $(this).data('type');

                _this.handleEmbedRequest(el, url, type);
            });
        },

        // handle Order Numbers
        handleOrderNumbers: function () {
            var _this = this;
            var type = $('.question-post-form').attr('data-type');

            if (type == 'quiz') {
                $('#results .entry').each(function (oo) {
                    var act = Math.ceil(oo);
                    var num = act + 1;
                    $(this).find('.order-number').text(num);
                });

                $('#entries .entry').each(function (oso) {
                    var acta = Math.ceil(oso);
                    var numa = acta + 1;
                    $(this).find('.order-number').text(numa);
                });

                _this.handleAssignSelect();

                _this.handleDraggableAnswers();

                return false;
            } else if (
                $('.lists-types a.selected').attr('data-order') == 'none' ||
                $('.lists-types a.selected').length == 0
            ) {
                $('.ordering').addClass('noorder');
            } else {
                $('.ordering').removeClass('noorder');
            }

            _this.handleDraggableAnswers();

            var tips = $('.entry').length;

            var dataorder = $('.lists-types a.selected').attr('data-order');

            $('.entry').each(function (oo) {
                var num;
                var act = Math.ceil(oo);

                if (dataorder == 'desc') {
                    num = tips - act;
                } else {
                    num = act + 1;
                }

                $(this).find('.order-number').text(num);
            });
        },

        // handle Assign Select
        handleAssignSelect: function () {
            var oep,
                osfep,
                num,
                selec = [],
                tire = '';
            var type = $('.question-post-form').attr('data-type');

            $('#results .entry').each(function (oo) {
                osfep = $(this).attr('data-co');

                oep = $(this).find('[data-type="title"]').val();

                if (oep > '') {
                    tire = ' - ';
                }

                num = oo + 1;

                selec[oo] = osfep + '|' + num + tire + oep.substr(0, 9);
            });

            $('[data-type="assign"]').each(function () {
                if ($(this).attr('type') == 'radio') {
                    return false;
                }

                var selectlist = '';
                var aaosfep = $(this).val();
                var selectededit = $(this).attr('data-acst');

                $(selec).each(function (index, value) {
                    var res = value.split('|');

                    if (res[0] == selectededit) {
                        //set if edited item
                        selectlist =
                            selectlist +
                            '<option selected="selected" data-co="' +
                            res[0] +
                            '" value="' +
                            index +
                            '">Result: ' +
                            res[1] +
                            '</option>';
                    } else if (index == selectededit) {
                        //set if edited item
                        selectlist =
                            selectlist +
                            '<option selected="selected" data-co="' +
                            res[0] +
                            '" value="' +
                            index +
                            '">' +
                            BuzzyEditorlang.result +
                            ': ' +
                            res[1] +
                            '</option>';
                    } else if (aaosfep == index) {
                        selectlist =
                            selectlist +
                            '<option selected="selected" data-co="' +
                            res[0] +
                            '" value="' +
                            index +
                            '">' +
                            BuzzyEditorlang.result +
                            ': ' +
                            res[1] +
                            '</option>';
                    } else {
                        selectlist =
                            selectlist +
                            '<option data-co="' +
                            res[0] +
                            '" value="' +
                            index +
                            '">' +
                            BuzzyEditorlang.result +
                            ': ' +
                            res[1] +
                            '</option>';
                    }
                });

                $(this).replaceWith(
                    '<select class="getassignres" data-type="assign"><option data-co="0" value="">' +
                        BuzzyEditorlang.assign +
                        '</option>' +
                        selectlist +
                        '</select>'
                );
            });
        },

        // handle Assign Select
        handleDraggableAnswers: function () {
            $('.answers').each(function (oo) {
                var osfep = $(this).attr('id');
                Sortable.create(document.getElementById(osfep), {
                    group: '.answer',
                    handle: '.drag-handle',
                    animation: 150
                });
            });
        },

        // initializes main settings
        handlePost: function () {
            var _this = this;
            $('.PostAction')
                .off('click')
                .on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    NProgress.inc();
                    Buzzy.initLoadingCaption('show');

                    var form = $(this).closest('form');
                    var post_status = $(this).attr('data-post-t');
                    var type = form.find('.question-post-form').attr('data-type');
                    var request_url = form.attr('action');
                    var _token = form.find('input[name=_token]').val();
                    var headline = form.find('input[name=headline]').val();
                    var post_slug = form.find('#post_slug_input').val();
                    var published_at = form.find('#published_at').val();
                    var language = form.find('#language').val();
                    var description = form.find('textarea[name=description]').val();
                    var tags = form.find('#tags').val();
                    var category = form.find('select[name=category]').val();
                    var pagination = form.find('select[name=pagination]').val();
                    var thumb = form.find('input[name=thumb]').val();
                    var main_slide_image = form.find('input[name=main_slide_image]').val();
                    var show_in_main_slide = (form.find('input[name=show_in_main_slide]').is(':checked')) ? '1' : '0';
                    var show_in_main_slide_2 = (form.find('input[name=show_in_main_slide_2]').is(':checked')) ? '1' : '0';
                    var show_in_breaking_news = (form.find('input[name=show_in_breaking_news]').is(':checked')) ? '1' : '0';
                    var ordertype = form
                        .find('.lists-types a.selected')
                        .attr('data-order');
                    if (
                        typeof ordertype == null ||
                        ordertype == '' ||
                        ordertype == undefined
                    ) {
                        ordertype = null;
                    }

                    var entries = [];

                    if ($('.entry').length == 0) {
                        swal(BuzzyEditorlang.lang_10);
                        NProgress.done(true);
                        Buzzy.initLoadingCaption('hide');
                        return false;
                    }

                    $('.entry').each(function (index, element) {
                        var dataid = $(this).attr('data-entry-id');
                        if (
                            typeof dataid == null ||
                            dataid == '' ||
                            dataid == undefined
                        ) {
                            dataid = null;
                        }
                        var datatype = $(this).attr('data-type');
                        if (
                            typeof datatype == null ||
                            datatype == '' ||
                            datatype == undefined
                        ) {
                            datatype = null;
                        }
                        var datatitle = $(this)
                            .find('.cd-input[data-type="title"]')
                            .first()
                            .val();
                        if (
                            typeof datatitle == null ||
                            datatitle == '' ||
                            datatitle == undefined
                        ) {
                            datatitle = null;
                        }
                        var databody = $(this)
                            .find('.cd-input[data-type="body"]')
                            .first()
                            .val();
                        if (
                            typeof databody == null ||
                            databody == '' ||
                            databody == undefined
                        ) {
                            databody = null;
                        } else {
                            databody = databody.replace('=', '##').replace('<', '%#');
                        }
                        var dataimage = $(this)
                            .find('.cd-input[data-type="image"]')
                            .first()
                            .val();
                        if (
                            typeof dataimage == null ||
                            dataimage == '' ||
                            dataimage == undefined
                        ) {
                            dataimage = null;
                        }
                        var datavideo = $(this)
                            .find('.cd-input[data-type="video"]')
                            .first()
                            .val();

                        if (
                            typeof datavideo == null ||
                            datavideo == '' ||
                            datavideo == undefined
                        ) {
                            datavideo = null;
                        } else {
                            datavideo = datavideo.replace('=', '##').replace('<', '%#');
                        }
                        var datasource = $(this)
                            .find('.cd-input[data-type="source"]')
                            .first()
                            .val();
                        if (
                            typeof datasource == null ||
                            datasource == '' ||
                            datasource == undefined
                        ) {
                            datasource = null;
                        }

                        if (datatype == 'quizquestion') {
                            var agaga = 0;

                            var qlisttype = $(this)
                                .find('[data-curtype="on"]')
                                .first()
                                .attr('data-query');
                            if (
                                typeof qlisttype == null ||
                                qlisttype == '' ||
                                qlisttype == undefined
                            ) {
                                qlisttype = null;
                            }

                            entries[index] = {
                                id: dataid,
                                type: datatype,
                                title: datatitle,
                                body: databody,
                                source: datasource,
                                image: dataimage,
                                listtype: qlisttype
                            };

                            entries[index]['answers'] = [];

                            $(element)
                                .find('.answer')
                                .each(function (ildo, elo) {
                                    var qdataid = $(this).attr('data-entry-id');
                                    if (
                                        typeof qdataid == null ||
                                        qdataid == '' ||
                                        qdataid == undefined
                                    ) {
                                        qdataid = null;
                                    }
                                    var qdatatype = $(this).attr('data-type');
                                    if (
                                        typeof qdatatype == null ||
                                        qdatatype == '' ||
                                        qdatatype == undefined
                                    ) {
                                        qdatatype = null;
                                    }
                                    var qdatatitle = $(this)
                                        .find('[data-type="title"]')
                                        .first()
                                        .val();
                                    if (
                                        typeof qdatatitle == null ||
                                        qdatatitle == '' ||
                                        qdatatitle == undefined
                                    ) {
                                        qdatatitle = null;
                                    }
                                    var qdataimage = $(this)
                                        .find('[data-type="image"]')
                                        .first()
                                        .val();
                                    if (
                                        typeof qdataimage == null ||
                                        qdataimage == '' ||
                                        qdataimage == undefined
                                    ) {
                                        qdataimage = null;
                                    }

                                    if (ordertype == 'trivia') {
                                        qdataassign = 'off';

                                        if (
                                            $(this)
                                                .find('[data-type="assign"]:checked')
                                                .val() == 'on'
                                        ) {
                                            qdataassign = 'on';
                                            agaga = 1;
                                        }
                                    } else {
                                        var qdataassign = $(this)
                                            .find('[data-type="assign"]')
                                            .first()
                                            .val();
                                        if (
                                            typeof qdataassign == null ||
                                            qdataassign == '' ||
                                            qdataassign == undefined
                                        ) {
                                            qdataassign = null;
                                        }
                                    }

                                    entries[index]['answers'][ildo] = {
                                        id: qdataid,
                                        type: qdatatype,
                                        title: qdatatitle,
                                        image: qdataimage,
                                        assign: qdataassign
                                    };
                                });
                            /*
                            if(agaga==0){
                                swal({
                                    title: BuzzyEditorlang.errorl,
                                    text: 'An answer is not selected as correct answer for question.',
                                    type: "error",
                                    timer: 1000,
                                    showConfirmButton: false
                                });
                                Buzzy.initLoadingCaption('hide');
                                NProgress.done(true);
                                return false;
                            }
                            */
                        } else if (datatype == 'poll') {
                            var qlisttype = $(this)
                                .find('[data-curtype="on"]')
                                .first()
                                .attr('data-query');
                            if (
                                typeof qlisttype == null ||
                                qlisttype == '' ||
                                qlisttype == undefined
                            ) {
                                qlisttype = null;
                            }

                            entries[index] = {
                                id: dataid,
                                type: datatype,
                                title: datatitle,
                                body: databody,
                                source: datasource,
                                image: dataimage,
                                listtype: qlisttype
                            };

                            entries[index]['answers'] = [];

                            $(element)
                                .find('.answer')
                                .each(function (ildo, elo) {
                                    var qdataid = $(this).attr('data-entry-id');
                                    if (
                                        typeof qdataid == null ||
                                        qdataid == '' ||
                                        qdataid == undefined
                                    ) {
                                        qdataid = null;
                                    }
                                    var qdatatype = $(this).attr('data-type');
                                    if (
                                        typeof qdatatype == null ||
                                        qdatatype == '' ||
                                        qdatatype == undefined
                                    ) {
                                        qdatatype = null;
                                    }
                                    var qdatatitle = $(this)
                                        .find('[data-type="title"]')
                                        .first()
                                        .val();
                                    if (
                                        typeof qdatatitle == null ||
                                        qdatatitle == '' ||
                                        qdatatitle == undefined
                                    ) {
                                        qdatatitle = null;
                                    }
                                    var qdataimage = $(this)
                                        .find('[data-type="image"]')
                                        .first()
                                        .val();
                                    if (
                                        typeof qdataimage == null ||
                                        qdataimage == '' ||
                                        qdataimage == undefined
                                    ) {
                                        qdataimage = null;
                                    }

                                    entries[index]['answers'][ildo] = {
                                        id: qdataid,
                                        type: qdatatype,
                                        title: qdatatitle,
                                        image: qdataimage,
                                        assign: '1'
                                    };
                                });
                        } else if (datatype == 'text') {
                            entries[index] = {
                                id: dataid,
                                type: datatype,
                                title: datatitle,
                                body: databody,
                                source: datasource
                            };
                        } else if (datatype == 'image') {
                            entries[index] = {
                                id: dataid,
                                type: datatype,
                                title: datatitle,
                                body: databody,
                                source: datasource,
                                image: dataimage
                            };
                        } else if (datatype == 'video') {
                            entries[index] = {
                                id: dataid,
                                type: datatype,
                                title: datatitle,
                                body: databody,
                                source: datasource,
                                video: datavideo
                            };
                        } else if (
                            datatype == 'embed' ||
                            datatype == 'tweet' ||
                            datatype == 'facebookpost' ||
                            datatype == 'instagram' ||
                            datatype == 'soundcloud'
                        ) {
                            entries[index] = {
                                id: dataid,
                                type: datatype,
                                title: datatitle,
                                body: databody,
                                source: datasource,
                                video: datavideo
                            };
                        } else {
                            entries[index] = {
                                id: dataid,
                                type: datatype,
                                title: datatitle,
                                body: databody,
                                image: dataimage,
                                source: datasource
                            };
                        }
                    });

                    if (
                        $('.lists-types').length > 0 &&
                        $('.lists-types a.selected').length == 0
                    ) {
                        swal('Choose list type');
                        NProgress.done(true);
                        Buzzy.initLoadingCaption('hide');
                        return false;
                    }

                    if ($('.entry').length < parseInt(pagination) && pagination != 0) {
                        swal(BuzzyEditorlang.lang_12);
                        NProgress.done(true);
                        Buzzy.initLoadingCaption('hide');
                        return false;
                    }

                    var data = {
                        post_status: post_status,
                        published_at: published_at,
                        language: language,
                        slug: post_slug,
                        title: headline,
                        description: description,
                        tags: tags,
                        category: category,
                        pagination: pagination,
                        type: type,
                        ordertype: ordertype,
                        thumb: thumb,
                        main_slide_image: main_slide_image,
                        show_in_main_slide: show_in_main_slide,
                        show_in_main_slide_2: show_in_main_slide_2,
                        show_in_breaking_news: show_in_breaking_news,
                        _token: _token,
                        entries: entries
                    };

                    $.ajax({
                        method: 'POST',
                        data: data,
                        url: request_url,
                        success: function (response) {
                            if (response.status == 'error') {
                                Buzzy.initLoadingCaption('hide');
                                NProgress.done(true);

                                swal({
                                    title: response.title,
                                    text: response.message,
                                    type: 'error',
                                    timer: 3000,
                                    html: true,
                                    showCancelButton: false,
                                    confirmButtonText: BuzzyEditorlang.lang_15
                                });
                            } else {
                                window.onbeforeunload = null;
                                location.href = response.url;
                            }
                        },
                        error: function (response) {
                            var message =
                                typeof response.responseJSON != 'undefined'
                                    ? response.responseJSON.errors
                                    : 'An Unexpected Error Occurred';
                            swal({
                                title: 'Error',
                                text: message,
                                type: 'error',
                                html: true,
                                showCancelButton: false,
                                confirmButtonText: BuzzyEditorlang.lang_15
                            });
                        }
                    }).always(function () {
                        Buzzy.initLoadingCaption('hide');
                        NProgress.done(true);
                    });
                });
        },

        init: function () {
            NProgress.set(0.4);

            this.handleSelectize();
            this.handlePublishDatePicker();

            this.handleSlugClicks();

            this.handlePost(); // initialize core variables

            // re initable parts for ajax request
            this.initAjax();

            NProgress.done(true);
        },

        //init Form Editor
        initAjax: function () {
            // imageform, pollform, questionform, resultform, answerform, pollanswerform
            this.handleImageUpload();

            // videoform, tweetform, facebookpostform, instagramform, soundcloudform
            this.handleEmbedGetClick();

            // answerform, pollanswerform
            this.handleAssignSelect();

            this.handleTextEditor();
            this.handleEntryClicks(); // initialize core variables
            this.handleNewEntryClick(); // initialize core variables
            this.handleOrderNumbers();
        }
    };

    window.onbeforeunload = function () {
        return BuzzyEditorlang.lang_16;
    };

    $(document).ready(function () {
        BuzzyEditor.init();
    });
})(jQuery, window, document);
