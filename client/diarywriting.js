FlowRouter.template('/diary_writing/:_id','diary_writing');

Template.diary_writing.onRendered(function () {
    $('#editor').summernote({
        toolbar: [
            ['Font Style',['fontsize','color']],
            ['insert',['picture','link','video']]
        ],
        lang: 'ko-KR',
        minHeight: 110,
        maximumImageFileSize: 1048576*10
    });
});

Template.diary_writing.onDestroyed(function () {

});


Template.diary_writing.helpers({
    diarys: function () {
        var _id = FlowRouter.getParam('_id');
        if(_id === 'newPosting') {
            return {};    //새글 작성일때는 화면에 비어있는 데이터를 제공.
        }
        Meteor.setTimeout(function() { //화면 에디터에 편집 모드를 초기화 하기 위한 트릭
            $('#editor').summernote('reset');
        });
        return DB_DIARY.findOne({_id:_id});
    },
    file: function() {
        return DB_FILES.findOne({_id: this.diary.file_id}).name;
    }
})

Template.diary_writing.events({
    'click #btn-diary-write':function () {
        var user_id = Meteor.user()._id;
        var date = $('#inp-day').val();
        var title = $('#inp-name').val();
        var file = $('#inp-music').prop('files')[0];
        var file_id = DB_FILES.insertFile(file);
        var text = $('#editor').summernote('code');
        if(!title){
            return alert('제목을 작성해주세요.');
        }
        if(!date){
            return alert('날짜를 작성해주세요.');
        }
        var _id = FlowRouter.getParam('_id');
        if( _id === 'newPosting'){
            var date_option1 = DB_DIARY.findOne({user_id: user_id,date:date});
            if(date_option1)
            {
                if(date_option1.money){
                    DB_DIARY.update({_id:date_option1._id}, {
                        $set: {
                            diary: {
                                title: title,
                                file_id: file_id,
                                text: text,
                                createdAt: new Date()
                            }
                        }
                    })
                    alert('일기를 작성하였습니다.');
                }
                else {
                    return alert('같은 날짜로된 일기가 이미 존재합니다.');
                }
            }
            else {
                DB_DIARY.insert({
                    date: date,
                    user_id: user_id,
                    diary:{
                        title: title,
                        file_id:file_id,
                        text: text,
                        createdAt: new Date(),
                    },
                    money:[{}]
                });
            }
            alert('일기를 작성하였습니다.');
        }
        else{
            var date_option2 = DB_DIARY.findOne({user_id: user_id,date:date});
            if(date_option2)
            {
                DB_DIARY.update({_id:date_option2._id},{
                    $set:{
                        diary: {
                            title: title,
                            file_id: file_id,
                            text: text,
                            createdAt: new Date()
                        }
                    }
                });
                alert('일기를 수정하였습니다.');
            }
           else {
                var past_diary = DB_DIARY.findOne({_id:_id});
                past_diary.date = date;
                past_diary.diary.title = title;
                past_diary.diary.text = text;
                past_diary.diary.createdAt = new Date();
                DB_DIARY.update({_id:_id}, past_diary);
                alert('일기를 수정하였습니다.');
            }
        }
        FlowRouter.go('/diary');
    }
});
