var JPlaceHolder = {
    //¼ì²â
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //³õÊ¼»¯
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //ÐÞ¸´
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span class="input_span_poin"></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top,paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
//Ö´ÐÐ
jQuery(function(){
    JPlaceHolder.init();    
});