const igmetallTarif40hEg2toEg12 = {
    'Stufe A': [0,0,2940,3088,3278,3678,3906,4212,4569,5004,5534,6120,6709],
    'Stufe B': [0,0,2989,3182,3374,3769,4042,4384,4761,5250,5816,6421,6996],
};

document.getElementById('weekHours').addEventListener('input', calculateResult);
document.getElementById('buttonMinus').addEventListener('click', calculateResult);
document.getElementById('buttonPlus').addEventListener('click', calculateResult);
document.getElementById('monthOfEmployment').addEventListener('change', calculateResult);
document.getElementById('duagonGrades').addEventListener('change', calculateResult);
document.getElementById('specialPaymentPercentage').addEventListener('input', calculateResult);

document.getElementById('monthlyPerformanceCheck').addEventListener('click', calculateResult);
document.getElementById('transformationMoneyCheck').addEventListener('click', calculateResult);
document.getElementById('tzugaCheck').addEventListener('click', calculateResult);
document.getElementById('vacationMoneyCheck').addEventListener('click', calculateResult);
document.getElementById('chrismasMoneyCheck').addEventListener('click', calculateResult);

function numberToStr(number) {
    return number.toLocaleString(
        navigator.language,
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }
    )
}

function workHours(countUp) {
    if (countUp) {
        document.getElementById('weekHours').stepUp();
    }
    else {
        document.getElementById('weekHours').stepDown();
    }
}

function showHideLegend(id) {
    if (id === 'showHideAll') {
        let buttonText = document.getElementById('showHideAll').innerHTML;
        let showHide = 'block';
        if (buttonText.includes('anzeigen')) {
            document.getElementById('showHideAll').innerHTML = 'Alle Erklärtexte verstecken';
        }
        else {
            showHide = '';
            document.getElementById('showHideAll').innerHTML = 'Alle Erklärtexte anzeigen';
        }
        // Get all elements with class ".hiddendiv" and "id" that end on "Desc"
        let divs = document.querySelectorAll('.hiddendiv[id$="Desc"]');
        for (let i=0; i<divs.length; i++) {
            divs[i].style.display = showHide;
        }
    } else {
        // slice "Title" from id string and append "Desc"
        let descId = id.slice(0, -5) + "Desc";
        let div = document.getElementById(descId);
        if (div.style.display === '') {
            div.style.display = 'block';
        } else {
            div.style.display = '';
        }
    }
}

function calculateResult() {
    let selectDuagonGrades = document.getElementById('duagonGrades');
    let monthOfEmployment = parseInt(document.getElementById('monthOfEmployment').value);
    let weekHours = parseFloat(document.getElementById('weekHours').value.replace(',', '.'));
    let selectedDuagonGrade = parseInt(selectDuagonGrades.options[selectDuagonGrades.selectedIndex].value);
    let specialPaymentPercentage = parseInt(document.getElementById('specialPaymentPercentage').value);
    let specialPaymentFactor = specialPaymentPercentage / 100.0;

    document.getElementById('specialPaymentTitle').innerHTML = 'Leistungsentgelt ' + specialPaymentPercentage + '%';

    if (selectedDuagonGrade >= 11) {
        selectedDuagonGrade = 11;
        document.getElementById('fatCatAlarm').style.display = 'block';
    }
    else {
        document.getElementById('fatCatAlarm').style.display = 'none';
    }

    let igmetallGroup = selectedDuagonGrade + 1;
    let igmetallRank = 'Stufe A';
    if (igmetallGroup <= 4 && monthOfEmployment >= 6) igmetallRank = 'Stufe B';
    else if (igmetallGroup <= 8 && monthOfEmployment >= 12) igmetallRank = 'Stufe B';
    else if (igmetallGroup <= 12 && monthOfEmployment >= 18) igmetallRank = 'Stufe B';

    let christmasMoneyFactor = 0
    if (monthOfEmployment < 6) christmasMoneyFactor = 0;
    else if (monthOfEmployment < 12) christmasMoneyFactor = 0.25;
    else if (monthOfEmployment < 24) christmasMoneyFactor = 0.35;
    else if (monthOfEmployment <= 35) christmasMoneyFactor = 0.45;
    else if (monthOfEmployment >= 36) christmasMoneyFactor = 0.55;

    let monthlyMoney = igmetallTarif40hEg2toEg12[igmetallRank][igmetallGroup] / 40 * weekHours;

    let monthlyMoneyPerformance = monthlyMoney * specialPaymentFactor;
    if (!document.getElementById("monthlyPerformanceCheck").checked) monthlyMoneyPerformance = 0;

    let monthlyMoneyPlus = monthlyMoney + monthlyMoneyPerformance;

    let chrismasMoney= monthlyMoneyPlus * christmasMoneyFactor;
    if (!document.getElementById("chrismasMoneyCheck").checked) chrismasMoney = 0;
    let transformationMoney = monthlyMoneyPlus * 0.184;
    if (!document.getElementById("transformationMoneyCheck").checked) transformationMoney = 0;
    else if (monthOfEmployment < 6) transformationMoney = 0;
    let tzuga = monthlyMoneyPlus * 0.275;
    if (!document.getElementById("tzugaCheck").checked) tzuga = 0;
    else if (monthOfEmployment < 6) tzuga = 0;
    let vacationMoney = monthlyMoneyPlus * 0.6896;
    if (!document.getElementById("vacationMoneyCheck").checked) vacationMoney = 0;

    let yearlyMoney = (monthlyMoneyPlus * 12) + vacationMoney + transformationMoney + tzuga + chrismasMoney;

    document.getElementById('specialPaymentDesc').innerHTML = 'Zusätzlich zu deinem monatlichen Grundentgelt ' +
        '(nach <a href="/entgelttabelle-metall-elektro/" target="_blank">Entgelttabelle</a>: '+ numberToStr(monthlyMoney) +'€) ' +
        'ist der Arbeitgeber verpflichtet ein Leistungsentgelt zu zahlen. Der Tarifvertrag legt fest, ' +
        'dass das Leistungsentgelt durchschnittlich im Betrieb bei 14 Prozent des monatlichen Grundentgeltes ' +
        'liegen soll. Das Leistungentgelt kann individuell zwischen 0 und 28 Prozent ' +
        'des monatlichen Grundsentgeltes liegen.';
    document.getElementById('monthlyMoneyTitle').innerHTML =
        'Monatlich: '+ numberToStr(monthlyMoneyPlus) +'€';
    document.getElementById('monthlyMoneyDesc').innerHTML =
        'Anhand deiner Angaben haben wir Dein mögliches Monatsentgelt berechnet, wenn der Tarifvertrag der Metall- ' +
        'und Elektroindustrie bei duagon gelten würde. Das Monatsentgelt setzt sich aus zwei Teilen zusammen:<br>' +
        '<ul><li>Eingruppierung in EG'+ igmetallGroup +' - '+ igmetallRank +': ' +
        'Grundentgelt in Höhe von '+ numberToStr(monthlyMoney) +'€' +
        '<li>Leistungsentgelt ('+ specialPaymentPercentage +'%): '+ numberToStr(monthlyMoneyPerformance) +'€' +
        '</ul>';
    document.getElementById('yearlyMoneyTitle').innerHTML =
        'Jährlich: '+ numberToStr(yearlyMoney) +'€';
    document.getElementById('yearlyMoneyDesc').innerHTML =
        'Über den Tarifvertrag der Metall- und Elektroindustrie erhältst Du zusätzlich zum Monatsentgelt regelmäßige ' +
        'Sonderzahlungen (z.B. zusätzliches Urlaubsgeld). Die Jahressumme aus allen Zahlungen siehst Du hier.';
    document.getElementById('igmetallTarifTitle').innerHTML =
        '<strong>IG Metall EG'+ igmetallGroup +' - '+ igmetallRank +':</strong><br>'+
        numberToStr(monthlyMoney) +'€ &#215; 12 = '+
            numberToStr(monthlyMoney * 12) +'€';
    document.getElementById('igmetallTarifDesc').innerHTML =
        'Deine unverbindliche Eingruppierung in den Tarifvertrag der ' +
        'Metall- und Elektroindustrie anhand Deiner Angaben.';
    document.getElementById('monthlyPerformanceTitle').innerHTML =
        '<strong>Leistungsentgelt:<br>Monat: </strong>'+
        numberToStr(monthlyMoney) +'€ &#215; '+ specialPaymentPercentage +'% = '+ numberToStr(monthlyMoneyPerformance)
        +'€<br><strong>Jahr:</strong>  '+ numberToStr(monthlyMoneyPerformance) +'€ &#215; 12 = '+
        numberToStr(monthlyMoneyPerformance * 12) +'€';
    document.getElementById('monthlyPerformanceDesc').innerHTML =
        'Das monatliche Leistungsentgelt zwischen 0 und 28 Prozent, durchschnittlich 14 Prozent.';
    document.getElementById('transformationMoneyTitle').innerHTML =
        '<strong>Transformationsgeld (T-Geld):</strong><br>'+ numberToStr(transformationMoney) +'€';
    document.getElementById('transformationMoneyDesc').innerHTML =
        'Sonderzahlung im Februar eines Jahres in Höhe von 18,4 Prozent eines Monatsentgeltes.<br><br>' +
        'Hinweis bei unter 6 Monaten:<br>Erst bei einer Betriebszugehörigkeit von länger als 6 Monaten ' +
        'besteht der Anspruch auf diese Sonderzahlung.';
    document.getElementById('tzugaTitle').innerHTML =
        '<strong>Tarifliches Zusatzgeld A (T-ZUG A):</strong><br>'+ numberToStr(tzuga) +'€';
    document.getElementById('tzugaDesc').innerHTML =
        'Sonderzahlung im Juli eines Jahres in Höhe von 27,5 Prozent eines Monatsentgeltes. Freiwillig wandelbar ' +
        'in 8 freie Tage, wenn Anspruchsgrund (Schichtarbeit, Kindererziehung, Pflege) besteht.<br><br>' +
        'Hinweis bei unter 6 Monaten:<br>Erst bei einer Betriebszugehörigkeit von länger als 6 Monaten besteht ' +
        'der Anspruch auf diese Sonderzahlung.';
    document.getElementById('vacationMoneyTitle').innerHTML =
        '<strong>Zusätzliches Urlaubsgeld:</strong><br>'+ numberToStr(vacationMoney) +'€';
    document.getElementById('vacationMoneyDesc').innerHTML =
        'Für jeden Tag des genommenen Urlaubs wird ein zusätzliches Urlaubsgeld in Höhe von 50 Prozent eines ' +
        'Tagesverdienstes ausgezahlt. Im Jahr ergibt sich bei 30 Tagen Urlaub eine Sonderzahlung in Höhe von rund ' +
        '68,96 Prozent eines Monatsentgeltes.<br><br>Hinweis bei unter 6 Monaten:<br>Bei einer Betriebszugehörigkeit ' +
        'unter 6 Monaten reduziert sich das zusätzliche Urlaubsgeld aufgrund der reduzierten Urlaubstage.';
    document.getElementById('chrismasMoneyTitle').innerHTML =
        '<strong>Anteiliges 13. Monatsentgelt:</strong><br>'+ numberToStr(chrismasMoney) +'€';
    document.getElementById('chrismasMoneyDesc').innerHTML =
        'Sonderzahlung im Dezember (Weihnachtsgeld) eines Jahres in Höhe von '+
        numberToStr(christmasMoneyFactor * 100) +' Prozent eines Monatsentgeltes. Je länger du ' +
        'im Unternehmen bist, um so höher fällt das anteilige 13. Monatsentgelt aus.<ul>' +
        '<li>Bis 12 Monate: 25 Prozent' +
        '<li>Bis 24 Monate: 35 Prozent' +
        '<li>Bis 36 Monate: 45 Prozent' +
        '<li>Über 36 Monate: 55 Prozent' +
        '</ul>Hinweis bei unter 6 Monaten:<br>Erst bei einer Betriebszugehörigkeit von länger als 6 Monaten besteht ' +
        'der Anspruch auf diese Sonderzahlung.';
}

calculateResult();
