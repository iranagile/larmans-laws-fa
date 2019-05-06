$(function() {


  $(".navbar-burger.burger").click(toggle_burger_menu);


});


/* tooltip initialization */
tippy('[data-tippy-template]',
  { arrow: true, animation: 'scale', theme: 'light-border', sticky: true, interactive: true, boundary: 'viewport' ,
    content: function(reference) {
      var ref = $(reference);
      var id = ref.attr('data-tippy-template');
      var linkedTemplate = $("#" + id);
      return linkedTemplate.html();
    }
  });

////// Methds ////////

/**
 * Toggle Burger menu
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function toggle_burger_menu(event) {
  $(".navbar-menu").toggleClass("is-active");
  $(this).toggleClass("is-active");
}
