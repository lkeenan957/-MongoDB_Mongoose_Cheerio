$(document).ready(function(){

var modal = $('#myModal');
	

	$("#scraper").off().on("click", function(){



		$("#news").empty();


		$.get("/scrape").done(function(data){
			// console.log(data)
			for (var i = 0; i < data.length; i++) {

				var newStory = $("<div>")
				newStory.addClass("container text-left newsList")
				$("#news").append(newStory)

				var newDiv = $("<h4>")
				newDiv.append(data[i].title)
				newStory.append(newDiv)


				var newSummary = $("<p>")
				newSummary.text(data[i].summary)
				newStory.append(newSummary)

				var newLink = $("<a>")
				newLink.addClass("row")
				newLink.attr("href", data[i].link)
				newLink.attr("target", "_blank")
				newLink.append("Read More Here")
				newStory.append(newLink)

				var newButton = $("<button>")
				newButton.addClass("save btn-warning")
				newButton.text("Save This Article")
				newStory.append(newButton)

			}
		})



	})

	$(document).on("click", ".save", function(){

		var data = {
			saveThisHeader: $(this).siblings("h4").text(),
			saveThisLink: $(this).siblings("a").attr("href"),
			saveThisSummary: $(this).siblings("p").text()
		}
		
		$.ajax({
			url: "/save",
			type: "POST",
			data: data
		}).done(function(response){
			// console.log("All done, here is your response: " + response)

			if (response.Error) {
				alert("Article Already In Your Saved Articles")
			} else {
				alert("Article Saved")
			}
		})


	})


	$(document).on("click", ".delete", function(){

		var data = {
			thisId: $(this).parent("div").attr("data-id")
		}
		
		$.ajax({
			url: "/save/" + data.thisId,
			type: "DELETE"
		}).done(function(response){
			// console.log("All done, here is your response: " + response)
			location.reload();
		})


	})

	$(document).on("click", "#submit", function(event){
		event.preventDefault();

		var newNote = {
			note: $(this).siblings("#note").val().trim(),
			id: $(this).parent("div").attr("data-id")
		}


		$(this).siblings("#note").val("")

		$.ajax({
			url: "/save/note",
			type: "POST",
			data: newNote
		}).done(function(response){
			// console.log(response)
			location.reload();	
		})

	})


	$(document).on("click", ".seeNotes", function(){
		var content = $(".modal-notes")
		content.empty();
		$(".modal-header").empty();

		var getNotes = {
			thisId: $(this).attr("data-id")
		}

		// console.log(getComments.thisId)

		$.get("/save/notes/" + getNotes.thisId).done(function(response){
			// console.log(response[0].comments)

			var contentHeader = $("<h4>")
			contentHeader.text("Comments for " + response[0].title)
			contentHeader.css("color", "black")
			$(".modal-header").append(contentHeader)
			
			for (var i = 0; i < response[0].notes.length; i++) {

				
				var newContent = $("<li>")

				newContent.text(response[0].notes[i])
				content.append(newContent)


			}



			modal.css("display", "block")

		})



	})

	$(document).on("click", ".close", function(){
		modal.css("display", "none")
	})

})


