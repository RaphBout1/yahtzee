const nbTirMax = 2;
let nbTir = 0;
//Sorry the variables are in Franglish

$(document).ready(function () {

  // #################### Events ####################

  /**Event on click of shot button
   */
  $("#lancer").on("click", function () {
    turn();
  });

  /**Event on click case cliquable
   */
  $(".cliquable").on("click", function () {
    changeTurn($(this));
  });

  // #################### Management Game ####################

  /**Manage turn or dices shots
   */
  function turn() {
    initTabDes();
    if (nbTir < nbTirMax) {
      $(".des:not(.select)").each(function () {
        printDes($(this));
      });

      if (nbTir == nbTirMax - 1) {
        $("#lancer").addClass("desactivate");
      }
      results();
    }
    nbTir = nbTir + 1;
  }

  /** Change turn and restore all for new turn
   * @param  {} caseSelect Case select in on click
   */
  function changeTurn(caseSelect) {
    if (!caseSelect.hasClass("caseSelect")) {
      if (nbTir != 0) {
        caseSelect.addClass("caseSelect").removeClass("cliquable");
        $("#lancer").removeClass("desactivate");
        $(".des").removeClass("select");
        $(".imgDes").remove();
        initTabDes();
        nbTir = 0;
        endGame();
      }
    }
  }

  /**Check if all case are selected for the end of game
   */
  function endGame() {
    if ($(".cliquable").length == 0) {
      if (confirm("Fin de partie vous avez : " + calculTotal() + " points")) {
        window.location.reload();
      }
    }
  }

  // #################### Management Dices ####################

  /**Print dices
   * @param  {} des not selected dices div
   */
  function printDes(des) {
    des.find(".imgDes").remove();
    let num = getRandomInt();
    var img = $("<img />", {
      class: "imgDes",
      src: "img/" + num + ".png",
      "data-num": num,
    });
    img.on("click", function () {
      selectDes(des);
    });
    img.css("transform","rotate("+getRandomRotation()+"deg)");
    img.appendTo(des);
  }

  /** Change class for select dice
   * @param  {} des the dice
   */
  function selectDes(des) {
    des.toggleClass("select");
  }

  /** get results of dices
   * @return array of dices numbers
   */
  function getResulDes() {
    resultArray = new Array();
    $(".des").each(function () {
      resultArray.push($(this).children().data("num"));
    });
    return resultArray;
  }
  /**Count occurences of dices
   * @returns object list (key = dice value, value = occurence)
   */
  function countOccurences() {
    counts = {};
    jQuery.each(getResulDes(), function (key, value) {
      !counts.hasOwnProperty(value) ? (counts[value] = 1) : counts[value]++;
    });
    return counts;
  }
  /**get random int 1-6
   * @returns int
   */
  function getRandomInt() {
    return Math.floor(Math.random() * 6) + 1;
  }
  /**Ger random int for rotate (1-360)
   */
  function getRandomRotation(){
    return Math.floor(Math.random() * 360) + 1;
  }

  // #################### Management Tables ####################

  /**Reinitalize table after case select
   */
  function initTabDes() {
    $("#pts tr:nth-child(-n+6) td:nth-child(2):not(.caseSelect)").text(0);
    $("#combine tr td:nth-child(3):not(.caseSelect)").text(0);
  }

  /** Fill all the differents case of tables
   */
  function results() {
    fillTabDes();
    fillTabCombine();
    totalTableDes();
    totaltableCombine();
  }


  /**Fill table of simple numbers whith results of shor
   */
  function fillTabDes() {
    $.each(countOccurences(), function (key, value) {
      $("#pts tr:nth-child(" + key + ") td:nth-child(2):not(.caseSelect)").text(
        key * value
      );
    });
  }

  /** Loop function for fill the combine table
   */
  function fillTabCombine() {
    let suite = {};
    let nbsuite = 1;
    let chance = 0;
    let desResponse = countOccurences();
    $.each(desResponse, function (key, value) {
      fillemultipleDicecase(value,key);
      fillFullCase(value,desResponse);

      chance = chance + key * value;
      //if key+1 in desResponse add in nbsuite or reset nbsuite  
      suite[key] = parseInt(key) + 1 in desResponse ? (nbsuite = nbsuite + 1) : (nbsuite = 1);
    });
    fillSequenceCase(suite);
    $("#combine tr:nth-child(7) td:nth-child(3):not(.caseSelect)").text(chance);
  }

    // #################### Calculs in Combien table ####################

  /**Fill cases of sequences
   * @param  {} suite Sequece object
   */
  function fillSequenceCase(suite){
    let maxsuite = 0;
    maxsuite = Math.max(...Object.values(suite));
    if (maxsuite >= 4) {
      $("#combine tr:nth-child(2) td:nth-child(3):not(.caseSelect)").text(30);
    }
    if (maxsuite == 5) {
      $("#combine tr:nth-child(3) td:nth-child(3):not(.caseSelect)").text(40);
    }
  }
  /**fill the multiple combine cases with value of dices multiply by occurrence
   * @param  {} value numbers of occurrences of dices
   * @param  {} key value of the dices
   */
  function fillemultipleDicecase(value , key){
    if (value >= 3) {
      $("#combine tr:nth-child(1) td:nth-child(3):not(.caseSelect)").text(
        key * 3
      );
    }
    if (value >= 4) {
      $("#combine tr:nth-child(5) td:nth-child(3):not(.caseSelect)").text(
        key * 4
      );
    }
    if (value == 5) {
      $("#combine tr:nth-child(6) td:nth-child(3):not(.caseSelect)").text(50);
    }
  }
  /** Fill full class
   * @param  {} value occurrences of dices
   * @param  {} desResponse object list of dices results
   */
  function fillFullCase(value,desResponse){
    if (value == 3 && Object.keys(desResponse).length == 2) {
      $("#combine tr:nth-child(4) td:nth-child(3):not(.caseSelect)").text(25);
    }
  }

      // #################### Calculs totals of tables ####################

  /**Calcul total of dice table with bonus if total>=63
   */
  function totalTableDes() {
    let total = 0;
    $("#pts td:nth-child(2).caseSelect").each(function () {
      total += parseInt($(this).text());
    });

    $("#pts tr:nth-child(7) td:nth-child(2)").text(total);

    if (total >= 63) {
      total = 0;
      $("#pts tr:nth-child(8) td:nth-child(2)").text(35);
    }

    $("#pts tr:nth-child(9) td:nth-child(2)").text(
      parseInt($("#pts tr:nth-child(8) td:nth-child(2)").text()) +
        parseInt($("#pts tr:nth-child(7) td:nth-child(2)").text())
    );
  }
  /**Calcul total of combine table
   */
  function totaltableCombine() {
    let total = 0;
    $("#combine td:nth-child(3).caseSelect").each(function () {
      total += parseInt($(this).text());
    });

    $("#combine tr:nth-child(8) td:nth-child(2)").text(total);
    $("#combine tr:nth-child(9) td:nth-child(2)").text(calculTotal());
  }
  /**calcul total of the game
   */
  function calculTotal() {
    return (
      parseInt($("#pts tr:nth-child(9) td:nth-child(2)").text()) +
      parseInt($("#combine tr:nth-child(8) td:nth-child(2)").text())
    );
  }

});
