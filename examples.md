<style>
.menu-group{
	display:inline-block;
}
.single-menu{
	width: 22%;
	min-height:350px;
    float:left;
    border: 2px solid black;
    border-radius: 5px;
	padding: 10px 10px;
	margin: 10px 10px;
	margin-top: 0px;
}
li{
	font-size: 16px;
}
.accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
}

.active, .accordion:hover {
    background-color: #ccc; 
}

.panel {
    padding: 0 18px;
    display: none;
    background-color: white;
    overflow: hidden;
}
</style>

<div class="menu-group">
	<h1>Example Functions Menu</h1>
	<div class="single-menu">
		<h3>Hello World</h3>
		<ul>
			<a href="./node-hello-world"><li>Node</li></a>
			<a href="./python-hello-world"><li>Python</li></a>
			<a href="./java8-hello-world"><li>Java8</li></a>
		</ul>
	</div>
   	<div class="single-menu">
		<h3>Languages</h3>
		<ul>
			<a href="./node"><li>Node</li></a>
			<a href="./python"><li>Python</li></a>
			<a href="./java8"><li>Java8</li></a>
		</ul>
	</div>
	<div class="single-menu">
		<h3>Spotinst Connection</h3>
			<a href="./endpoints"><li>Endpoints</li></a>
			<a href="./document-store"><li>Document Store</li></a>
			<a href="./emr"><li>EMR</li></a>
			<a href="./elastigroup"><li>Elastigroup</li></a>
	</div>
	<div class="single-menu">
		<h3>Other Examples</h3>
			<a href="./node-twitter-vision"><li>Twitter</li></a>
			<a href="./node-lyft-webApp"><li>Lyft</li></a>
			<a href="./node-pagerduty-connection"><li>PagerDuty</li></a>
			<a href="./datadog"><li>DataDog</li></a>
			<a href="./node-static-binary"><li>Static Binary</li></a>
			<a href="./node-sns-endpoint"><li>SNS Endpoint</li></a>
			<a href="./node-alexa-skill"><li>Alexa Skill</li></a>
			<a href="./node-raffle-app"><li>Raffle Web App</li></a>
			<a href="./node-simple-chatbot"><li>Chat Bot Web App</li></a>
	</div>
</div>




<h2>Accordion</h2>

<button class="accordion">Section 1</button>
<div class="panel">
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
</div>

<button class="accordion">Section 2</button>
<div class="panel">
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
</div>

<button class="accordion">Section 3</button>
<div class="panel">
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
</div>

<script>
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}
</script>










