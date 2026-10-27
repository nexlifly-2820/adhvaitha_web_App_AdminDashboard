const fs = require('fs');
const filePath = 'C:/Users/DELL/Documents/adhvaitha_pickles_app/lib/widgets/tab_transition_video_overlay.dart';
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Update _initializeVideo
const oldInit = `  Future<void> _initializeVideo(String url) async {
    _currentUrl = url;
    await _controller?.dispose();`;

const newInit = `  Future<void> _initializeVideo(String url) async {
    _currentUrl = url;
    await _controller?.dispose();
    _controller = null;

    if (url.toLowerCase().contains('.gif')) {
      if (mounted) setState(() => _isInitialized = true);
      return;
    }`;

code = code.replace(oldInit, newInit);

// 2. Update build stack
const oldStack = `              // 1. Video Player with BoxFit.cover fill screen (1080 x 2340 aspect)
              if (_isInitialized && _controller != null)
                SizedBox.expand(
                  child: FittedBox(
                    fit: BoxFit.cover,
                    child: SizedBox(
                      width: _controller!.value.size.width > 0 ? _controller!.value.size.width : 1080,
                      height: _controller!.value.size.height > 0 ? _controller!.value.size.height : 2340,
                      child: VideoPlayer(_controller!),
                    ),
                  ),
                )
              else
                // 2. Full-screen GIF Fallback
                Image.asset(
                  'assets/images/ambhujakshi_loading_fullscreen.gif',`;

const newStack = `              // 1. Full-screen GIF Support (Network or Asset)
              if (_currentUrl.toLowerCase().contains('.gif'))
                _currentUrl.startsWith('http')
                  ? Image.network(
                      _currentUrl,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                      errorBuilder: (_, __, ___) => Image.asset(
                        'assets/images/ambhujakshi_loading_fullscreen.gif',
                        fit: BoxFit.cover,
                        width: double.infinity,
                        height: double.infinity,
                      ),
                    )
                  : Image.asset(
                      _currentUrl.startsWith('assets/') ? _currentUrl : 'assets/images/$_currentUrl',
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                      errorBuilder: (_, __, ___) => Image.asset(
                        'assets/images/ambhujakshi_loading_fullscreen.gif',
                        fit: BoxFit.cover,
                        width: double.infinity,
                        height: double.infinity,
                      ),
                    )
              // 2. Video Player with BoxFit.cover fill screen (1080 x 2340 aspect)
              else if (_isInitialized && _controller != null)
                SizedBox.expand(
                  child: FittedBox(
                    fit: BoxFit.cover,
                    child: SizedBox(
                      width: _controller!.value.size.width > 0 ? _controller!.value.size.width : 1080,
                      height: _controller!.value.size.height > 0 ? _controller!.value.size.height : 2340,
                      child: VideoPlayer(_controller!),
                    ),
                  ),
                )
              else
                // 3. Full-screen GIF Fallback
                Image.asset(
                  'assets/images/ambhujakshi_loading_fullscreen.gif',`;

code = code.replace(oldStack, newStack);

fs.writeFileSync(filePath, code.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully updated tab_transition_video_overlay.dart with normalized line endings!');
