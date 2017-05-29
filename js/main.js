/*--------loader script-----------*/
$(function(){
    var loading = $('#loadbar').hide();
    $(document)
        .ajaxStart(function () {
            loading.show();
        }).ajaxStop(function () {
        loading.hide();
    });

    /*-- timer --*/
    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        //var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            //'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        //var daysSpan = clock.querySelector('.days');
        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');

        function updateClock() {
            var t = getTimeRemaining(endtime);

            //daysSpan.innerHTML = t.days;
            hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            //What happens when the time is up
            if (t.total <= 0) {
                clearInterval(timeinterval);
                // Get the modal
                var modal = document.getElementById('myModal');

                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];

                // Show modal
                    modal.style.display = "block";

                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                    modal.style.display = "none";
                    window.location="index.html";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                        window.location="index.html";
                    }
                }

            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
    }

    var deadline = new Date(Date.parse(new Date()) + 2 * 60 * 60 * 1000);
    initializeClock('clockdiv', deadline);

    /*-- /timer --*/



    /*-- quiz --*/
    var questionNo = 0;
    var correctCount = 0;
    var q = [
        {'Q':'What does HTML stand for?', 'A':1,'C':['Hyper Text Markup Language','Hyperlinks and Text Markup Language','Home Tool Markup Language', 'Happily Transmitted Melody of Liliput']},
        {'Q':'_____is an Internet standard for sending electronic mail', 'A':2,'C':['HTTPS','SMTP','FTP', 'HTTP']},
        {'Q':'_____is a standard network protocol used to copy a file from one host to another over a TCP/IP-based network.', 'A':3,'C':['HTTPS','SMTP','FTP', 'HTTP']},
        {'Q':'Which one is NOT developers concern, when they are developing websites', 'A':3,'C':['Fitting in screens','Loading speed','Operating System', 'Browser compatibility']},
        {'Q':'What does CSS stand for?', 'A':2,'C':['Creative Steal Shoes', 'Cascading Style Sheets','Creative Style Sheets', 'Computer Style Sheets']}
    ];


    $(document.body).on('click',"label.element-animation",function (e) {
        //ripple start
        var parent, ink, d, x, y;
        parent = $(this);
        if(parent.find(".ink").length == 0)
            parent.prepend("<span class='ink'></span>");

        ink = parent.find(".ink");
        ink.removeClass("animate");

        if(!ink.height() && !ink.width())
        {
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({height: "100px", width: "100px"});
        }

        x = e.pageX - parent.offset().left - ink.width()/2;
        y = e.pageY - parent.offset().top - ink.height()/2;

        ink.css({top: y+'px', left: x+'px'}).addClass("animate");
        //ripple end

        //progress bar
        var bar = document.getElementsByClassName("progress-bar");
        var width = 1;
        var perPercent = (width/q.length) * 100;
        bar[0].style.width = perPercent * (questionNo + 1 ) + '%';
        //progress bar

        var choice = $(this).parent().find('input:radio').val();
        console.log(choice);
        var anscheck =  $(this).checking(questionNo, choice);
        q[questionNo].UC = choice;
        if(anscheck){
            correctCount++;
            q[questionNo].result = "Correct";
        } else {
            q[questionNo].result = "Incorrect";
        }
        console.log("CorrectCount:" + correctCount);

        setTimeout(function(){
            $('#loadbar').show();
            $('#quiz').fadeOut();
            questionNo++;
            if((questionNo + 1) > q.length){
                $.alert({
                    title: 'Congratulations!',
                    content: 'You have completed the quiz.'
                });

                setTimeout(function(){
                    document.getElementById("clockdiv").style.display = "none";
                    var toAppend = '';
                    $.each(q, function(i, a){
                        toAppend += '<tr>';
                        toAppend += '<td>'+(i+1)+'</td>';
                        toAppend += '<td>'+a.A+'</td>';
                        toAppend += '<td>'+a.UC+'</td>';
                        toAppend += '<td>'+a.result+'</td>';
                        toAppend += '</tr>'
                    });
                    $('#quizResult').html(toAppend);
                    $('#totalCorrect').html("Your score is: " + correctCount + "/" + q.length);
                    if (correctCount >= (70 * q.length)/100) {
                        $('#pass').html("You passed the quiz");
                        document.getElementById("fail").style.display = "none";
                    } else {
                        $('#fail').html("You failed the quiz. You can re-take the quiz later.");
                        document.getElementById("pass").style.display = "none";
                    }
                    $('#quizResult').show();
                    $('#loadbar').fadeOut();
                    $('#result-of-question').show();
                    $('#graph-result').show();
                    chartMake();
                }, 1000);
            } else {
                $('#qid').html(questionNo + 1);
                $('input:radio').prop('checked', false);
                setTimeout(function(){
                    $('#quiz').show();
                    $('#loadbar').fadeOut();
                }, 1500);
                $('#question').html(q[questionNo].Q);
                $($('#f-option').parent().find('label')).html(q[questionNo].C[0]);
                $($('#s-option').parent().find('label')).html(q[questionNo].C[1]);
                $($('#t-option').parent().find('label')).html(q[questionNo].C[2]);
                $($('#d-option').parent().find('label')).html(q[questionNo].C[3]);
            }
        }, 1000);
    });


    $.fn.checking = function(qstn, ck) {
        var ans = q[questionNo].A;
        if (ck != ans)
            return false;
        else
            return true;
    };


});

