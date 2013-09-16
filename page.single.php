<?php $theme->display('header'); ?>

	<div class="page_section">

		<div id="content" class="section<?php if( $post->info->is_bragger ): ?> bragger<?php endif; ?><?php if( $post->info->columns == 'content'): ?> full<?php endif; ?>">
			<?php echo $post->content_out; ?>
			
			<span class="clear"></span>
		</div>
	
		<? if( empty( $post->info->columns ) || ($post->info->columns == 'content+sidebar') ) { $theme->display('sidebar'); } ?>
		
		<span class="clear"></span>
		
	</div>

<?php $theme->display('footer'); ?>