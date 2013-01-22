<li class="position<?php echo $position->tags; ?>">
	<h4><?php echo $position->title; ?></h4>
	<h5><?php echo $position->employer; ?></h5>
	<p class="dates"><strong class="start"><?php echo $position->start; ?></strong>–<strong class="end"><?php echo $position->end; ?></strong></p>
	<?php echo $position->content; ?>
</li>