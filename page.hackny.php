<?php
$theme->banner = array(
	'greeting' => '<h1>Hi there</h1><p>I&apos;m <strong class="name">Morgante</strong> and I would love to be a <strong class="purpose">HackNY 2013</strong> fellow.</p>',
	'definition' => '<ol class="bragger navigation">
	<li id="nav-skills"><a href="#skills">Skills</a></li>
	<li id="nav-entrepreneurship"><a href="#entrepreneurship">Entrepreneurship</a></li>
	<li id="nav-education"><a href="#education">Education</a></li>
	<li id="nav-experience"><a href="#experience">Experience</a></li>
	<li id="nav-volunteering"><a href="#volunteering">Volunteering</a></li>
	<li id="nav-travel"><a href="#skills">Travel</a></li>
	</ol>'
);

Stack::add( 'template_stylesheet', array(Site::get_url('theme') . '/css/bragger.css', 'screen'), 'bragger', array('style') );
Stack::add( 'template_header_javascript', Site::get_url('theme') . '/js/bragger.js', 'bragger', array( 'jquery', 'd3') );

$theme->display('header');
?>

	<div class="page_section">
		
		<div id="content" class="section bragger full">
			<section id="skills">
				<header>
					<div class="container">
						<h2>I&apos;ve got <em>serious</em> <strong class="section">skills</strong></h2>
					</div>
				</header>
				<div class="container">
					<p class="help">Click a skill to see relevant experience</p>
					<div class="graph"></div>
				</div>
			</section>
		
			<section id="entrepreneurship">
				<header>
					<div class="container">
						<h2>I <em>&hearts;</em> <strong>entrepreneurship</strong></h2>
					</div>
				</header>
				<div class="container">
					<p class="lede">I&apos;ve started <strong>3</strong> companies of my own and am eager to learn at a growing startup.</p>
					<ul class="companies positions exampler three">
						<li class="position" id="position-mastermade">
							<h2><a href="http://mastermade.us"><span>Visit</span><em>MasterMade</em></a></h2>
							<p>Since starting this web development company in <strong class="start">2005</strong>, I&apos;ve designed and developed websites for clients ranging from international corporations to local nonprofits. Working on MasterMade gave me my start in both programming and entrepreneurship and it has pushed me to constantly expand both my technical and business skills.</p>								
						</li>
						<li class="position" id="position-crassus">
							<h2><a href="http://crassusinvest.com"><span>Visit</span><em>Crassus Investments</em></a></h2>
							<p>I started this investment fund in <strong class="start">2011</strong> with partners from <strong>7</strong> countries. In addition to making primary investment decisions as the fund's general manager and raising over <strong>$50,000</strong> in capital, I built a custom system for monitoring the fund in realtime and rapidly communicating information with partners.</p>								
						</li>
						<li class="position" id="position-fundshift">
							<h2><a href="http://fundshift.co"><span>Visit</span><em>FundShift</em></a></h2>
							<p>Building on the custom platform from FundShift, I am creating a financial innovation startup which will increase transparency in the financial sector. Our platform will make it easier for fund managers to share information with investors and connect investors, including first-time investors, with managers who will be open to communicating with them.</p>								
						</li>
						<li class="clear"></li>
					</ul>
				</div>
				<span class="clear"></span>
			</section>
			
			<section id="education">
				<header>
					<div class="container">
						<h2>I have a unique <strong>education</strong></h2>
					</div>
				</header>
				<div class="container">
					<p class="lede">My education has exposed me to diverse people and fields.</p>
					<ul class="education positions exampler two">
						<li class="position" id="position-nyuad">
							<h2><a href="http://newlyancient.com/2012/04/25/nyuad"><span>Learn why I chose</span><em>New York University Abu Dhabi</em></a></h2>
							<p>As a student at NYUAD, NYU's new <strong>honors college</strong> in the Middle East</em>, I study a <strong>liberal arts</strong> curriculum, concentrating in computer science, economics, and political science. As the chair of the student government's <strong>research &amp; development committee</strong>, I develop technical solutions for students, including an <strong>OAuth</strong>-based student directory written in <strong>Node.js</strong> and deployed on <strong>Heroku</strong>.</p>								
						</li>
						<li class="position" id="position-uwc">
							<h2><a href="http://en.wikipedia.org/wiki/Armand_Hammer_United_World_College_of_the_American_West"><span>Learn more about</span><em>United World College-USA</em></a></h2>
							<p>Together with 200 students from 70 different countries, I studied the <strong>International Baccalaureate</strong> on a <strong>full scholarship</strong> at this international boarding school in <strong>New Mexico</strong>. While there, I transitioned to an electronic voting system for the <strong>student government</strong>, organized the school&apos;s <strong>annual conference</strong>, and pioneered a computational approach to conflict resolution (our forté) with <strong>agent-based modeling</strong>.</p>								
						</li>
						<li class="clear"></li>
					</ul>
				</div>
				<span class="clear"></span>
			</section>
			
			<section id="experience">
				<header>
					<div class="container">
						<h2>I have deep <strong>experience</strong></h2>
					</div>
				</header>
				<div class="container">
					<p class="lede">My education has exposed me to diverse people and fields.</p>
					<ul class="education positions exampler two">
						<li class="position" id="position-nyuad">
							<h2><a href="http://newlyancient.com/2012/04/25/nyuad"><span>Learn why I chose</span><em>New York University Abu Dhabi</em></a></h2>
							<p>As a student at NYUAD, NYU's new <strong>honors college</strong> in the Middle East</em>, I study a <strong>liberal arts</strong> curriculum, concentrating in computer science, economics, and political science. As the chair of the student government's <strong>research &amp; development committee</strong>, I develop technical solutions for students, including an <strong>OAuth</strong>-based student directory written in <strong>Node.js</strong> and deployed on <strong>Heroku</strong>.</p>								
						</li>
						<li class="position" id="position-uwc">
							<h2><a href="http://en.wikipedia.org/wiki/Armand_Hammer_United_World_College_of_the_American_West"><span>Learn more about</span><em>United World College-USA</em></a></h2>
							<p>Together with 200 students from 70 different countries, I studied the <strong>International Baccalaureate</strong> on a <strong>full scholarship</strong> at this international boarding school in <strong>New Mexico</strong>. While there, I transitioned to an electronic voting system for the <strong>student government</strong>, organized the school&apos;s <strong>annual conference</strong>, and pioneered a computational approach to conflict resolution (our forté) with <strong>agent-based modeling</strong>.</p>								
						</li>
						<li class="clear"></li>
					</ul>
				</div>
				<span class="clear"></span>
			</section>
		</div>
			
		<span class="clear"></span>
		
	</div>

<?php $theme->display('footer'); ?>