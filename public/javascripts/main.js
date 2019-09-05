
//DELETE cuisine

$(document).ready(function(){
    $('.container__list__delete').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/cuisines/'+id,
            success: function(res){
                // alert('Deleting Article');
                window.location.href= '/cuisines';

            },
            error: function(err){
                console.log(err);
            }
        });
    });

});


//View new block
$(document).ready(function(){
    $('.container__list__button-edit').on('click', function(e){
          $( ".edit-block" ).css( "display", "flex" );
          var id = $(this).data('id');
          $('.edit-block form').attr('action','/cuisines/edit/'+id);
        
     });
    
});

// visiable value in input


$(document).ready(function(){
    $('.container__list__button-edit').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        const title = $target.attr('value');
        $.ajax({
            type: 'GET',
            url: '/cuisines/edit/'+id,
            success: function(res){
       
               $("#cuisine_edit").val(title);
   
            },
            error: function(err){
                console.log(err);
            }
        });
        
    
        
    });
});





