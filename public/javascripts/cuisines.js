// import { error } from "util";

//Style input type file

var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
        labelVal = label.innerHTML;
    input.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files)
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
        if (this.files)
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

     //loading image

     $('INPUT[type="file"]').change(function () {
        var ext = this.value.match(/\.(.+)$/)[1];
        switch (ext) {
           
            case 'png':
           
              
                $(".error_image").css("display", "none");
                $("#error_button").css({"pointer-events":"auto", "opacity":"1" });
                break;
            default:
                $(".error_image").css("display", "flex");
                $("#error_button").css({"pointer-events":"none", "opacity":"0.7" });
               
                this.value = '';
        }
    });

       //loading image

       $('#file-edit').change(function () {
        var ext = this.value.match(/\.(.+)$/)[1];
        switch (ext) {
           
            case 'png':
       
                $(".error_image").css("display", "none");
                $("#error_button-edit").css({"pointer-events":"auto", "opacity":"1" });
                
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
        smoke.confirm ("Do you want to delete the cuisine?", function (result) {
            if (result === false) { return window.location = '';}; //Выбрали отмена
            $.ajax({
                type: 'DELETE',
                url: '/cuisines/' + id,
                success: function (res) {
                    smoke.alert ("Cuisine was deleted!", function (result) {window.location = '';})
    
                },
                error: function (err) {
                    console.log(err);
                }
            });

       
        })
       
    });

    //Show new block


    $('.container__list__button-edit').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        const title = $target.attr('value');
        $.ajax({
            type: 'GET',
            url: '/cuisines/edit/' + id,
            success: function (res) {

                $("#category_edit").val(title);

            },
            error: function (err) {
                console.log(err);
            }
        });



    });

 



  

    //Method for update dish (attr-id)

    $('.container__list__button-edit').on('click', function (e) {
        $(".container__new-cuisine").css("display", "none");
        $(".container__edit-cuisine").css("display", "flex");
        var id = $(this).data('id');
        $('#edit-block form').attr('action', '/cuisines/edit/' + id);

    });



});

