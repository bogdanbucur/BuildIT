$(document).ready(function () {
    /* Get the checkbox values based on the class attached to each check box */
    $("#finish").click(function() {
        getValueUsingClass();
    });

});

function getValueUsingClass()
{
    let chkArray = [];

    $('.messageCheckbox:checked').each(function() {
        chkArray.push($(this).val());
    });

    /* check if there is selected checkboxes, by default the length is 1 as it contains one single comma */
    if(chkArray.length > 1){
        $('input[name=pidArray]').val(chkArray);
        $('input[name=config]').val($('#configName').val());
        $('#addToCartForm').submit();
    }else{
        alert("Please at least one of the checkbox");
    }

}