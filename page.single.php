<?php $theme->display('header'); ?>

	<div class="page_section">

		<div id="content" class="section">
			<?php echo $post->content_out; ?>
		</div>
	
		<? $theme->display('sidebar'); ?>
		
		<span class="clear"></span>
		
	</div>

<?php $theme->display('footer'); ?>