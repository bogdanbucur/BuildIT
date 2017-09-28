$(document).ready(function () {
    (function ($) {
        $('#filterBoards').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable1 tr').hide();
            $('.searchable1 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
        $('#filterCpu').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable2 tr').hide();
            $('.searchable2 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
        $('#filterGpu').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable3 tr').hide();
            $('.searchable3 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
        $('#filterRam').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable4 tr').hide();
            $('.searchable4 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
        $('#filterSsd').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable5 tr').hide();
            $('.searchable5 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
        $('#filterPowerSupply').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable6 tr').hide();
            $('.searchable6 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
        $('#filterHdd').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable7 tr').hide();
            $('.searchable7 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        });
        $('#filterCases').keyup(function () {
            let rex = new RegExp($(this).val(), 'i');
            $('.searchable8 tr').hide();
            $('.searchable8 tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        })
    }(jQuery));
});