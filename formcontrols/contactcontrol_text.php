<?php
if ( !defined( 'HABARI_PATH' ) ) { die('No direct access'); }

if( isset( $control->validators['validate_required'] ) ) {
	$required = true;
}
else {
	$required = false;
}

// Utils::debug( $control->errors );

if( count( $control->errors) > 0 ) {
	$error = $control->errors[0];
	// Utils::debug( $control->errors );
}
else {
	$error = false;
}

if( $control->help != NULL && $error == false ) {
	$help = $control->help;
}
else {
	$help = false;
}

?>
<div class="field info text <?php echo $id; ?><?php if( $required ): ?> required<?php endif; ?><?php if( $help ): ?> helped<?php endif; ?><?php if($error): ?> error<?php endif; ?>">
	<label for="<?php echo $field; ?>"><?php echo $caption; ?></label>
	<input type="text" name="<?php echo $field; ?>" id="<?php echo $field; ?>" value="<?php echo $value; ?>" size="22" tabindex="<?php echo $tabindex; ?>">
	<?php if( $error ): ?><p class="error"><?php echo $error; ?></p><?php endif; ?>
	<?php if( $help ): ?><p class="help"><?php echo $help; ?><?php if( $required ): ?> <strong class="required">(Required)</strong><?php endif; ?></p><?php endif; ?>
</div>