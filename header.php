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
				
				<?php if( $banner['greeting'] ): ?>
				<div class="section greeting">
					<?php echo $banner['greeting']; ?>
				</div>
				<?php endif; ?>
			
				<div class="logo">
					<a href="<?php echo Site::get_url('habari'); ?>" title="My logo">Morgante Pell</a>
				</div>
				
				<?php if( $banner['definition'] ): ?>
				<div class="section definition">
					<?php echo $banner['definition']; ?>
				</div>
				<?php endif; ?>
				
				<span class="clear"></span>
				
			</div>
			
		</div>
		
		<div id="page">
			
			