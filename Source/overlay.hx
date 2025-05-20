private async void SetTopmost()
{
    if(User32.GetHearthstoneWindow() == IntPtr.Zero)
    {
        Log.Info("Hearthstone window not found");
        return;
    }

    for(var i = 0; i < 20; i++)
    {
        var isTopmost = User32.IsTopmost(new WindowInteropHelper(this).Handle);
        if(isTopmost)
        {
            Log.Info($"Overlay is topmost after {i + 1} tries.");
            return;
        }

        Topmost = false;
        Topmost = true;
        await Task.Delay(250);
    }

    Log.Info("Could not set overlay as topmost");
}
