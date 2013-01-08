<!DOCTYPE html>

<html lang="en">

	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

		<title><?php Options::out( 'title' ) ?></title>
	
		<meta name="generator" content="Habari">

		<link rel="openid.server" href="http://www.myopenid.com/server" />
		<link rel="openid.delegate" href="http://arthus.myopenid.com/" />
		<link rel="openid2.local_id" href="http://arthus.myopenid.com" />
		<link rel="openid2.provider" href="http://www.myopenid.com/server" />
		<meta http-equiv="X-XRDS-Location" content="http://www.myopenid.com/xrds?username=arthus.myopenid.com" />

		<?php echo $theme->header(); ?>
		
	</head>
	
	<body class="<?php echo $orion_page; ?>">
		
		<div id="grid_overlay">
			<div class="grid">&nbsp;</div>
		</div>
		
		<div id="header" class="header">
			
			<div class="page_section">
			
				<div class="section greeting">
					<h1>Hello.</h1>
					<p>My name is <strong>Morgante Pell</strong>.</p>
				</div>
			
			
				<div class="logo">
					<a href="<?php echo Site::get_url('habari'); ?>" title="My logo">Morgante Pell</a>
				</div>
			
				<div class="section definition">
					<h2>Morgante Pell (proper noun)</h2>
					<p>A <a href="<?php echo Post::get(array('slug' => 'about'))->permalink; ?>#work">developer</a>, <a href="<?php echo Post::get(array('slug' => 'about'))->permalink; ?>#work">entrepreneur</a>, <a href="<?php echo Post::get(array('slug' => 'about'))->permalink; ?>#student">student</a>, and <a href="<?php echo Post::get(array('slug' => 'about'))->permalink; ?>#writer">writer</a>.</p>
				</div>
				
				<span class="clear"></span>
				
			</div>
			
		</div>
		
		<div id="page">
			
			