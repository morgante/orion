<?php
$theme->banner = array(
	'greeting' => '<h1>Hi there</h1><p>I&apos;m <strong class="name">Morgante</strong> and here are <strong class="count">8</strong> reasons to select me as a <strong class="purpose">HackNY 2013</strong> fellow.</p>',
	'definition' => '<ol class="bragger navigation">
		<li id="nav-skills"><a href="#skills">Skills</a></li>
	<li id="nav-entrepreneurship"><a href="#entrepreneurship">Entrepreneurship</a></li>
	<li id="nav-experience"><a href="#experience">Experience</a></li>
	<li id="nav-good"><a href="#good">Volunteering</a></li>
	<li id="nav-education"><a href="#education">Education</a></li>
	<li id="nav-projects"><a href="#projects">Projects</a></li>
	<li id="nav-elsewhere"><a href="#elsewhere">Web</a></li>
	<li id="nav-fun"><a href="#fun">Passions</a></li>
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
					<ul class="companies positions exampler splitter three">
						<li class="section position" id="position-mastermade">
							<h2><a href="http://mastermade.us"><span>Visit</span><em>MasterMade</em></a></h2>
							<p>Since starting this web development company in <strong class="start">2005</strong>, I&apos;ve designed and developed websites for clients ranging from international corporations to local nonprofits. Working on MasterMade gave me my start in both programming and entrepreneurship and it has pushed me to constantly expand both my technical and business skills.</p>								
						</li>
						<li class="section position" id="position-crassus">
							<h2><a href="http://crassusinvest.com"><span>Visit</span><em>Crassus Investments</em></a></h2>
							<p>I started this investment fund in <strong class="start">2011</strong> with partners from <strong>7</strong> countries. In addition to making primary investment decisions as the fund's general manager and raising over <strong>$50,000</strong> in capital, I built a custom system for monitoring the fund in realtime and rapidly communicating information with partners.</p>								
						</li>
						<li class="section position" id="position-fundshift">
							<h2><a href="http://fundshift.co"><span>Visit</span><em>FundShift</em></a></h2>
							<p>Building on the custom platform from FundShift, I am creating a financial innovation startup which will increase transparency in the financial sector. Our platform will make it easier for fund managers to share information with investors and connect investors, including first-time investors, with managers who will be open to communicating with them.</p>								
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
					<p class="lede">I play well with others and have worked with startups in the past.</p>
					<ul class="experience positions exampler splitter three">
						<li class="section position globalclassroom" id="position-globalclassroom">
							<h2><a href="http://globalclassroom.us/"><span>Visit</span><em>GlobalClassroom</em></a></h2>
							<p>As a paid <strong>programming intern</strong> at <strong>GlobalClassroom</strong>, a Vermont e-learning <strong>startup</strong>, in <strong class="start">2008</strong>, I designed and developed interfaces for their online <strong>classroom environment</strong>. In particular, I led the development of <strong>social features</strong>, allowing students to interact with the friends on the platform.</p>														
						</li>
						<li class="section position nyuad" id="position-nyuadcs">
							<h2><a href="http://nyuad.nyu.edu/news-events/conferences/nyuad-hackathon-2013.html"><span>See the Hackathon for</span><em>NYUAD Computer Science</em> </a></h2>
							<p>As a <strong>intern</strong> in the <strong>computer science department</strong> I oversaw NYUAD&apos;s participation in the first NYU <strong>Global Idea Exchange</strong> and am organizing our annual <strong>hackathon</strong> by building systems for managing registrations and other task. I also developed a custom <strong>Facebook application</strong> for assessing and measuring voter <strong>partisanship</strong>.</p>							
						</li>
						<li class="section position sila" id="position-sila">
							<h2><a href="http://www.silaconnection.com/"><span>Visit</span><em>Sila Connection</em></a></h2>
							<p>As the <strong>webmaster</strong> for the inaugural Sila Connection <strong>conference</strong>, I worked on the <strong>executive committee</strong> to plan this conference focused on <strong>environmental</strong> isssues in <strong>Abu Dhabi</strong>. In addition to provided high-quality design deliverables on <strong>tight deadlines</strong>, I programmed a custom system for integrating and publicizing <strong>Dropbox</strong> uploads during the conference.</p>
						</li>
						<li class="clear"></li>
					</ul>
				</div>
				<span class="clear"></span>
			</section>
			
			<section id="good">
				<header>
					<div class="container">
						<h2>I use my skills for good by <strong>volunteering</strong></h2>
					</div>
				</header>
				<div class="container">
					<p class="lede">These are some of my contributions.</p>
					<ul class="volunteer positions exampler splitter two">
						<li class="section position" id="position-habari">
							<h2><a href="http://lab.morgante.net"><span>See some of my plugins for</span><em>Habari</em></a></h2>
							<p>Since <strong class="start">2007</strong>, I have been contributing to <strong>Habari</strong>, an <strong>open source</strong> blogging engine written in <strong>PHP5</strong>. In addition to submitting many <strong>bug fixes</strong> and <strong>features</strong> to the <strong>core repository</strong>, I have written over a dozen <strong>plugins</strong> integrating services such as <strong>Simplenote</strong> and <strong>Dropbox</strong>.</p>								
						</li>
						<li class="section position s2oh" id="position-s2oh">
							<h2><a href="http://students2oh.net"><span>See</span><em>Students 2.0</em></a></h2>
							<p>After a <strong>successful launch</strong> with a widely-distributed <strong>countdown</strong>, I acted as the <strong>publisher</strong> for this <strong>award-winning</strong> educational blog, <strong>designing</strong> the blog and <strong>coordinating</strong> an international group of <strong>student writers</strong> to produce content reaching <strong>thousands of teachers</strong>.</p>						
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
					<ul class="education positions exampler splitter two">
						<li class="section position nyuad" id="position-nyuad">
							<h2><a href="https://github.com/nyuadsg"><span>See what I&apos;ve built for</span><em>New York University Abu Dhabi</em></a></h2>
							<p>As a student at NYUAD, NYU's new <strong>honors college</strong> in the Middle East</em>, I study a <strong>liberal arts</strong> curriculum, concentrating in computer science, economics, and political science. As the chair of the student government's <strong>research &amp; development committee</strong>, I develop technical solutions for students, including an <strong>OAuth</strong>-based student directory written in <strong>Node.js</strong> and deployed on <strong>Heroku</strong>.</p>								
						</li>
						<li class="section position" id="position-uwc">
							<h2><a href="http://en.wikipedia.org/wiki/Armand_Hammer_United_World_College_of_the_American_West"><span>Learn more about</span><em>United World College-USA</em></a></h2>
							<p>Together with 200 students from 70 different countries, I studied the <strong>International Baccalaureate</strong> on a <strong>full scholarship</strong> at this international boarding school in <strong>New Mexico</strong>. While there, I transitioned to an electronic voting system for the <strong>student government</strong>, organized the school&apos;s <strong>annual conference</strong>, and pioneered a computational approach to conflict resolution (our forté) with <strong>agent-based modeling</strong>.</p>								
						</li>
						<li class="clear"></li>
					</ul>
				</div>
				<span class="clear"></span>
			</section>
			
			<section id="projects">
				<header>
					<div class="container">
						<h2>I&apos;ve worked on many development <strong>projects</strong></h2>
					</div>
				</header>
				<div class="container">
					<p class="lede">Here are 3 of my latest projects:</p>
					<div class="canvas">
						<ul class="projects">
							<li class="project telling_the_times javascript">
								<a href="http://lab.morgante.net/clock">
									<img src="https://dl.dropbox.com/u/190441/images/telling_the_times.png">
									<h2>Telling the Times</h2>
									<p><strong>Telling the Times</strong> is a chronographical essay, written with JavaScript as an artistic response to Christian Marclay&apos;s <em>The Clock</em>.</p>
								</a>
							</li>
							<li class="project lewis_creek php design web">
								<a href="http://lewiscreek.org">
									<img src="https://dl.dropbox.com/u/190441/images/lewis_creek.png">
									<h2>Lewis Creek</h2>
									<p>This website I created for the <strong>Lewis Creek Association</strong> includes custom plugins I wrote to integrate Scribd into the publishing workflow.</p>
								</a>
							</li>
							<li class="project habaribox php habari">
								<a href="http://lab.morgante.net/habaribox">
									<img src="https://dl.dropbox.com/u/190441/images/habaribox.png">
									<h2>HabariBox</h2>
									<p>This plugin I wrote for <strong>Habari</strong> makes it easy to post media from your DropBox to your blog.</p>
								</a>
							</li>
						</ul>
					</div>
					
				</div>
				<span class="clear"></span>
			</section>
			
			<section id="elsewhere">
				<header>
					<div class="container">
						<h2>I&apos;m all over the <strong>web</strong></h2>
					</div>
				</header>
				<div class="container">
					
					<ul class="apps icons">
						<li class="twitter"><a href="http://twitter.com/morgantepell"><span>&raquo;</span>Twitter</a></li>
						<li class="delicious"><a href="http://delicious.com/arthus"><span>&raquo;</span>Delicious</a></li>
						<li class="linkedin"><a href="http://linkedin.com/in/morgante"><span>&raquo;</span>LinkedIn</a></li>
						<li class="github"><a href="http://github.com/morgante"><span>&raquo;</span>GitHub</a></li>
						<li class="blog newlyancient"><a href="http://newlyancient.com"><span>&raquo;</span>My Blog</a></li>
						<li class="lab lemnos"><a href="http://lab.morgante.net"><span>&raquo;</span>My Lab</a></li>
					</ul>
				</div>
				<span class="clear"></span>
			</section>
			
			<span class="clear"></span>
		
			<section id="fun">
				<header>
					<div class="container">
						<h2>I have <strong>passions</strong> besides programming:</h2>
					</div>
				</header>
				<div class="container">
					<ul class="splitter three">
						<li class="section fun hiking" id="fun-hiking">
							<h2><strong>Expeditioning</strong></h2>
							<img alt="Kayaking in Alaska" src="https://dl.dropbox.com/u/190441/images/kayaking.png" width="289" height="130" />
						</li>
						<li class="section fun debate stack" id="fun-debate">
							<h2><strong>Debating</strong></h2>
							<img alt="Kayaking in Alaska" src="https://dl.dropbox.com/u/190441/images/debating.png" width="289" height="130" />
						</li>
						<li class="section fun travel double" id="fun-travel">
							<h2><strong>Travelling</strong><p>I have friends from all over the world and love to travel.</p></h2>
							<div class="canvas" id="travel_map_canvas"></div>
						</li>
					
						<li class="clear"></li>
					</ul>
				</div>
				<span class="clear"></span>
			</section>
			
			<p id="conclusion">Thank you for your consideration!</p>
			
			<span class="clear"></span>
		
		</div>
		
	</div>

<?php $theme->display('footer'); ?>