FlowRouter.template('/update_profile','profile');

Template.profile.onRendered(function () {
    $('html').css('height', '100%');
    $('body').css('height', '100%');
    $('#__blaze-root').css('height', '100%');
});

Template.profile.onDestroyed(function () {
    $('html').css('height', '');
    $('body').css('height', '');
    $('#__blaze-root').css('height', '');
})


Template.profile.events({
    'click #btn-update-profile': function() {
        var userInfo = Meteor.user();
        var name = $('#inp-name').val();
        var address = $('#inp-address').val();
        var mobile = $('#inp-mobile').val();

        Meteor.users.update({_id: userInfo._id}, {
            $set: { // 사용자 객체의 profile 프로퍼티는 사용자 기타 정보를 저장 하는 공통 된 위치 입니다.
                'username': name,
                'profile.address': address,
                'profile.mobile': mobile
            }
        });

        alert('사용자 프로파일을 수정 하였습니다.');
    }
});