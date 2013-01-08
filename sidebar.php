<div id="sidebar" class="aside">
	
	<div class="navigation">
		<ul>
			<?php foreach( $navigation as $nav_item): ?>
			<li class="item <?php echo $nav_item->slug; ?><?php if( isset( $nav_item->active ) && $nav_item->active ): ?> active<?php endif; ?>">
				<a href="<?php echo $nav_item->permalink; ?>"><?php echo $nav_item->title; ?></a>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
	
	<?php echo $theme->twitter(); ?>
	
</div>