
// import { error } from "util";
/*Smoke pure*/
 
//Style input type file


var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
        labelVal = label.innerHTML;
    input.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
            fileName = e.target.value.split('\\').pop();
        if (fileName)
            label.querySelector('span').innerHTML = fileName;
        else
            label.innerHTML = labelVal;
    });
});

//Style input type file-edit

var inputs = document.querySelectorAll('.inputfile_edit');
Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
        labelVal = label.innerHTML;
    input.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
            fileName = e.target.value.split('\\').pop();
        if (fileName)
            label.querySelector('span').innerHTML = fileName;

        else
            label.innerHTML = labelVal;
    });
});


$(document).ready(function () {

    //add new alternative block
    $('.add__block').on('click', function (e) {
        $('#alternative-general').clone().insertAfter('#alternative-general');

    });

    $('.add__block-edit').on('click', function (e) {
        $('#alternative').clone().insertAfter('#alternative');

    });





    //loading image

    $('INPUT[type="file"]').change(function () {
        var ext = this.value.match(/\.(.+)$/)[1];
        switch (ext) {

            case 'jpg':
            case 'jpeg':


                $(".error_image").css("display", "none");
                $("#error_button").css({ "pointer-events": "auto", "opacity": "1" });
                break;
            default:
                $(".error_image").css("display", "flex");
                $("#error_button").css({ "pointer-events": "none", "opacity": "0.7" });

                this.value = '';
        }
    });

    //loading image

    $('#filenew').change(function () {
        var ext = this.value.match(/\.(.+)$/)[1];
        switch (ext) {

            case 'jpg':
            case 'jpeg':

                $(".error_image").css("display", "none");
                $("#error_button-edit").css({ "pointer-events": "auto", "opacity": "1" });

                break;
            default:
                $(".error_image").css("display", "flex");

                this.value = '';
        }
    });


    //Method for deleted item



    $('.container__list__delete').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        smoke.confirm ("Do you want to delete the dish?", function (result) {
            if (result === false) { return window.location = '';}; //Выбрали отмена
            $.ajax({
                type: 'DELETE',
                url: '/dishes/' + id,
                success: function (res) {
                
                    smoke.alert ("Dish was deleted!", function (result) {window.location = '';})
    
                },
                error: function (err) {
                    console.log(err);
                }
            });

       
        })

       
    });

    //Show new block


    $('.button_edit').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        const title = $target.attr('data-title');
        const alternative = $target.attr('data-alternative');
        const source = $target.attr('data-source');
        const description = $target.attr('data-description');

        const datacategory = $target.attr('data-category');
        const datacuisine = $target.attr('data-cuisine');

        const image = $target.attr('data-image');
        $.ajax({
            type: 'GET',
            url: '/dishes/edit/' + id,
            success: function (res) {

                $("#title").val(title);
                $("#alternative").val(alternative);
                $("#source").val(source);
                $("#description").val(description);
                $("#image").attr(data-photo, image);

                $("#image").val(image);

                $("#category").val(datacategory);
                $("#cuisine").val(datacuisine);

            },
            error: function (err) {
                console.log(err);
            }
        });



    });


    //Show new edit block

    $('.button_edit').on('click', function (e) {
        $(".container__new-dish").css("display", "none");
        $(".container__edit-dish").css("display", "flex");
        var id = $(this).data('id');
        $('#edit-block form').attr('action', '/dishes/edit/' + id);

    });



});

